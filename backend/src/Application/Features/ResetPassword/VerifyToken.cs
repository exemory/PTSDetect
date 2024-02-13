using Application.Common.Constants;
using Application.Common.Interfaces;
using Application.Extensions;
using FluentValidation;

namespace Application.Features.ResetPassword;

public record VerifyResetPasswordTokenInput(string UserId, string Token);

public class VerifyResetPasswordTokenInputValidator : AbstractValidator<VerifyResetPasswordTokenInput>
{
    public VerifyResetPasswordTokenInputValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.Token)
            .NotEmpty();
    }
}

[ExtendObjectType(GraphQlTypes.Query)]
public class VerifyResetPasswordTokenQuery
{
    public async Task<ResetPasswordTokenVerificationPayload> VerifyResetPasswordToken(
        [Service] IIdentityService identityService,
        [Service] IValidator<VerifyResetPasswordTokenInput> inputValidator,
        VerifyResetPasswordTokenInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return new ResetPasswordTokenVerificationPayload(
                null,
                validationResult.UnionErrors<IResetPasswordTokenVerificationErrorUnion>()
            );
        }

        var tokenValidationResult = await identityService.ValidateResetPasswordTokenAsync(
            input.UserId, input.Token, cancellationToken);

        return new ResetPasswordTokenVerificationPayload(
            tokenValidationResult is { IsSuccess: true, Value: true },
            null
        );
    }
}

[UnionType("ResetPasswordTokenVerificationErrorUnion")]
public interface IResetPasswordTokenVerificationErrorUnion;

public record ResetPasswordTokenVerificationPayload(
    bool? IsVerified,
    IEnumerable<IResetPasswordTokenVerificationErrorUnion>? Errors);