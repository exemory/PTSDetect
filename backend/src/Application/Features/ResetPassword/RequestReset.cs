using System.Web;
using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Extensions;
using Application.Options;
using FluentValidation;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.Extensions.Options;
using Void = Application.ScalarTypes.Void;

namespace Application.Features.ResetPassword;

public record RequestPasswordResetInput(string Email);

public class RequestPasswordResetInputValidator : AbstractValidator<RequestPasswordResetInput>
{
    public RequestPasswordResetInputValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
    }
}

[ExtendObjectType(GraphQlTypes.Mutation)]
public class RequestPasswordResetMutation
{
    [Error<ValidationError>]
    [Error<UserNotFoundError>]
    [Error<InternalServerError>]
    public async Task<MutationResult<Void>> RequestPasswordReset(
        [Service] IUserService userService,
        [Service] IIdentityService identityService,
        [Service] IMailService mailService,
        [Service] IValidator<RequestPasswordResetInput> inputValidator,
        [Service] IOptions<FrontendOptions> frontendOptions,
        RequestPasswordResetInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return validationResult.Errors.ToMutationResult();
        }

        var userInfoResult = await userService.GetUserInfoByEmailAsync(input.Email, cancellationToken);
        if (userInfoResult.IsFailure)
        {
            return userInfoResult.Errors.ToMutationResult();
        }

        var userInfo = userInfoResult.Value;

        var passwordResetTokenResult =
            await identityService.GeneratePasswordResetTokenAsync(userInfo.Email, cancellationToken);
        if (passwordResetTokenResult.IsFailure)
        {
            return passwordResetTokenResult.Errors.ToMutationResult();
        }

        var urlEncodedToken = HttpUtility.UrlEncode(passwordResetTokenResult.Value);
        var resetPasswordLink = $"{frontendOptions.Value.ResetPasswordUrl}?userId={userInfo.Id}" +
                                $"&token={urlEncodedToken}";

        var sendMailResult = await mailService.SendResetPasswordEmailAsync(
            userInfo.Email,
            userInfo.PersonalInfo?.FirstName,
            resetPasswordLink,
            cancellationToken);

        return sendMailResult.ToMutationResult();
    }
}