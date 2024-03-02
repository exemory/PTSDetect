using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Extensions;
using FluentValidation;
using HotChocolate;
using HotChocolate.Types;
using Void = Application.ScalarTypes.Void;

namespace Application.Features.ResetPassword;

public record ResetPasswordInput(string UserId, string Token, string NewPassword);

public class ResetPasswordInputValidator : AbstractValidator<ResetPasswordInput>
{
    public ResetPasswordInputValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.Token)
            .NotEmpty();

        RuleFor(x => x.NewPassword)
            .NotEmpty();
    }
}

[ExtendObjectType(GraphQlTypes.Mutation)]
public class ResetPasswordMutation
{
    [Error<ValidationError>]
    [Error<UserNotFoundError>]
    [Error<ResetPasswordFailedError>]
    public async Task<MutationResult<Void>> ResetPassword(
        [Service] IIdentityService identityService,
        [Service] IValidator<ResetPasswordInput> inputValidator,
        ResetPasswordInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return validationResult.Errors.ToMutationResult();
        }

        var passwordResetResult = await identityService.ResetPasswordAsync(
            input.UserId,
            input.Token,
            input.NewPassword,
            cancellationToken);

        return passwordResetResult.ToMutationResult();
    }
}