using Application.Common.Constants;
using Application.Common.Interfaces;
using Application.Extensions;
using FluentValidation;

namespace Application.Features.Auth;

public record IsEmailTakenInput(string Email);

public class IsEmailTakenInputValidator : AbstractValidator<IsEmailTakenInput>
{
    public IsEmailTakenInputValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
    }
}

[ExtendObjectType(GraphQlTypes.Query)]
public class IsEmailTakenQuery
{
    public async Task<IsEmailTakenPayload> IsEmailTaken(
        [Service] IIdentityService identityService,
        [Service] IValidator<IsEmailTakenInput> inputValidator,
        IsEmailTakenInput input,
        CancellationToken cancellationToken)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return new IsEmailTakenPayload(
                null,
                validationResult.UnionErrors<IIsEmailTakenErrorUnion>()
            );
        }

        var isEmailTakenResult = await identityService.IsEmailTaken(input.Email, cancellationToken);

        return new IsEmailTakenPayload(
            isEmailTakenResult.Value,
            null
        );
    }
}

[UnionType("IsEmailTakenErrorUnion")]
public interface IIsEmailTakenErrorUnion;

public record IsEmailTakenPayload(
    bool? IsEmailTaken,
    IEnumerable<IIsEmailTakenErrorUnion>? Errors);