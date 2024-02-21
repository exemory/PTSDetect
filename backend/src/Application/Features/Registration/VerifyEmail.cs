using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Extensions;
using FluentValidation;
using Void = Application.ScalarTypes.Void;

namespace Application.Features.Registration;

public record VerifyEmailInput(string UserId, string Token);

public class EmailVerificationInputValidator : AbstractValidator<VerifyEmailInput>
{
    public EmailVerificationInputValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.Token)
            .NotEmpty();
    }
}

[ExtendObjectType(GraphQlTypes.Mutation)]
public class VerifyEmailMutation
{
    [Error<ValidationError>]
    [Error<UserNotFoundError>]
    [Error<EmailVerificationFailedError>]
    public async Task<MutationResult<Void>> VerifyEmail(
        [Service] IIdentityService identityService,
        [Service] IValidator<VerifyEmailInput> inputValidator,
        VerifyEmailInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return validationResult.Errors.ToMutationResult();
        }

        var verifyEmailResult = await identityService.VerifyEmailAsync(
            input.UserId,
            input.Token,
            cancellationToken);

        return verifyEmailResult.ToMutationResult();
    }
}