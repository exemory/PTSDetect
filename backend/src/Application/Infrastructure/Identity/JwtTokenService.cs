using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Common.Models;
using Application.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Result = Application.Primitives.Result;

namespace Application.Infrastructure.Identity;

public class JwtTokenService(
    IOptionsMonitor<JwtOptions> options,
    TimeProvider timeProvider,
    IUserRepository userRepository,
    ILogger<JwtTokenService> logger) : ITokenService
{
    private readonly JwtOptions _accessJwtOptions = options.Get(JwtOptions.Auth);
    private readonly JwtOptions _refreshJwtOptions = options.Get(JwtOptions.Refresh);

    public async Task<Result.Result<TokenPair>> GenerateTokenPairAsync(string userId, IEnumerable<string> userRoles,
        CancellationToken cancellationToken = default)
    {
        var accessToken = GenerateAccessToken(userId, userRoles);

        var refreshTokenId = Guid.NewGuid();
        var refreshToken = GenerateRefreshToken(userId, refreshTokenId.ToString());

        await userRepository.AddRefreshToken(userId, refreshTokenId, cancellationToken);

        return new TokenPair(accessToken, refreshToken);
    }

    public async Task<Result.Result<TokenPair>> RefreshAccessTokenAsync(string refreshToken,
        IEnumerable<string> userRoles, CancellationToken cancellationToken = default)
    {
        var readTokenResult = ReadRefreshToken(refreshToken);
        if (readTokenResult.IsFailure)
        {
            return readTokenResult.Errors;
        }

        var jwtRefreshToken = readTokenResult.Value;

        var userId = jwtRefreshToken.Claims
            .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)
            ?.Value;

        if (userId is null)
        {
            logger.LogWarning("User provided refresh token doesn't have name identifier claim");
            return new InvalidRefreshTokenError();
        }

        var refreshTokenId = Guid.Parse(jwtRefreshToken.Id);
        var doesTokenExists = await userRepository.CheckTokenExistence(userId, refreshTokenId, cancellationToken);

        if (!doesTokenExists)
        {
            return new InvalidRefreshTokenError();
        }

        var removeTokenTask = userRepository.RemoveRefreshToken(userId, refreshTokenId, cancellationToken);
        var newTokenPair = await GenerateTokenPairAsync(userId, userRoles, cancellationToken);

        await removeTokenTask;

        return newTokenPair;
    }

    public Task<Result.Result<string>> GetTokenOwnerIdAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var readTokenResult = ReadRefreshToken(refreshToken);
        if (readTokenResult.IsFailure)
        {
            return Task.FromResult<Result.Result<string>>(readTokenResult.Errors);
        }

        var jwtRefreshToken = readTokenResult.Value;

        var userId = jwtRefreshToken.Claims
            .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)
            ?.Value;

        if (userId is null)
        {
            logger.LogWarning("User provided refresh token doesn't have name identifier claim");
            return Task.FromResult<Result.Result<string>>(new InvalidRefreshTokenError());
        }

        return Task.FromResult<Result.Result<string>>(userId);
    }

    private Token GenerateAccessToken(string userId, IEnumerable<string> userRoles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId)
        };

        claims.AddRange(userRoles.Select(x => new Claim(ClaimTypes.Role, x)));

        return GenerateToken(_accessJwtOptions, claims);
    }

    private Token GenerateRefreshToken(string userId, string tokenId)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new(JwtRegisteredClaimNames.Jti, tokenId)
        };

        return GenerateToken(_refreshJwtOptions, claims);
    }

    private Token GenerateToken(JwtOptions jwtOptions, IEnumerable<Claim> claims)
    {
        var signingCredentials = GenerateSigningCredentials(jwtOptions.Secret);
        var expirationDate = timeProvider.GetUtcNow() + jwtOptions.Lifetime;

        var tokenOptions = new JwtSecurityToken
        (
            signingCredentials: signingCredentials,
            issuer: jwtOptions.Issuer,
            audience: jwtOptions.Audience,
            expires: expirationDate.UtcDateTime,
            claims: claims
        );

        var tokenValue = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        return new Token(tokenValue, expirationDate);
    }

    private static SigningCredentials GenerateSigningCredentials(string secret)
    {
        var secretBytes = Encoding.UTF8.GetBytes(secret);
        var key = new SymmetricSecurityKey(secretBytes);
        return new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    }

    private Result.Result<JwtSecurityToken> ReadRefreshToken(string refreshToken)
    {
        JwtSecurityToken validatedJwt;
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _refreshJwtOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = _refreshJwtOptions.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_refreshJwtOptions.Secret)),
            ValidateLifetime = true,
            ClockSkew = _refreshJwtOptions.ClockSkew
        };

        try
        {
            tokenHandler.ValidateToken(refreshToken, tokenValidationParameters, out var validatedToken);
            validatedJwt = (JwtSecurityToken) validatedToken;
        }
        catch (Exception)
        {
            return new InvalidRefreshTokenError();
        }

        return validatedJwt;
    }
}