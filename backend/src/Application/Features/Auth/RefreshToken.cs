using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Extensions;
using HotChocolate.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Auth;

[ExtendObjectType(GraphQlTypes.Mutation)]
public class RefreshTokenMutation
{
    [Authorize(AuthPolicies.RefreshToken)]
    [Error<UserNotFoundError>]
    public async Task<MutationResult<Token>> RefreshToken(
        [Service] ITokenService tokenService,
        [Service] IIdentityService identityService,
        [Service] IHttpContextAccessor httpContextAccessor,
        CancellationToken cancellationToken = default)
    {
        var httpContext = httpContextAccessor.HttpContext!;

        var providedRefreshToken = httpContext.Request.GetRefreshToken();
        if (providedRefreshToken is null)
        {
            return new InvalidRefreshTokenError().ToMutationResult<Token>();
        }

        var tokenOwnerResult = await tokenService.GetTokenOwnerIdAsync(providedRefreshToken, cancellationToken);
        if (tokenOwnerResult.IsFailure)
        {
            return tokenOwnerResult.Errors.ToMutationResult<Token>();
        }

        var userId = tokenOwnerResult.Value;
        var userRolesResult = await identityService.GetUserRolesAsync(userId, cancellationToken);
        if (userRolesResult.IsFailure)
        {
            return userRolesResult.Errors.ToMutationResult<Token>();
        }

        var refreshTokenResult = await tokenService.RefreshAccessTokenAsync(providedRefreshToken,
            userRolesResult.Value, cancellationToken);
        if (refreshTokenResult.IsFailure)
        {
            return refreshTokenResult.Errors.ToMutationResult<Token>();
        }

        var (newAccessToken, newRefreshToken) = refreshTokenResult.Value;

        httpContext.Response.AddRefreshToken(newRefreshToken);
        return newAccessToken;
    }
}