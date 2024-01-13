using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Extensions;
using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Auth;

public record LoginInput(string Email, string Password);

public class LoginInputValidator : AbstractValidator<LoginInput>
{
    public LoginInputValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
        RuleFor(x => x.Password)
            .NotEmpty();
    }
}

[ExtendObjectType(GraphQlTypes.Mutation)]
public class LoginMutation
{
    [Error<ValidationError>]
    [Error<InvalidCredentialsError>]
    public async Task<MutationResult<Token>> Login(
        [Service] IIdentityService identityService,
        [Service] ITokenService tokenService,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IValidator<LoginInput> inputValidator,
        LoginInput input,
        CancellationToken cancellationToken)
    {
        var httpContext = httpContextAccessor.HttpContext!;

        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return validationResult.Errors.ToMutationResult<Token>();
        }

        var loginResult = await identityService.LoginByPasswordAsync(input.Email, input.Password, cancellationToken);
        if (loginResult.IsFailure)
        {
            return loginResult.Errors.ToMutationResult<Token>();
        }

        var userInfo = loginResult.Value;
        var tokenPairResult = await tokenService.GenerateTokenPairAsync(userInfo.Id, userInfo.Roles, cancellationToken);

        if (tokenPairResult.IsFailure)
        {
            return tokenPairResult.Errors.ToMutationResult<Token>();
        }

        var (accessToken, refreshToken) = tokenPairResult.Value;
        httpContext.Response.AddRefreshToken(refreshToken);

        return accessToken;
    }
}