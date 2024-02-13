using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Extensions;
using Application.Infrastructure.Identity;
using FluentValidation;
using Void = Application.ScalarTypes.Void;

namespace Application.Features.Registration;

public record RegisterUserInput(
    string Email,
    string Password,
    string? Firstname,
    string? Lastname,
    DateOnly Birthdate,
    Sex Sex,
    bool IsMarried);

public class RegisterUserInputValidator : AbstractValidator<RegisterUserInput>
{
    public RegisterUserInputValidator()
    {
        RuleFor(x => x.Email)
            .NotNull()
            .EmailAddress();
        RuleFor(x => x.Password)
            .NotEmpty();
        RuleFor(x => x.Firstname)
            .Length(1, 100);
        RuleFor(x => x.Lastname)
            .Length(1, 100);
        RuleFor(x => x.Birthdate)
            .NotEmpty()
            .InclusiveBetween(new DateOnly(1900, 1, 1), DateOnly.FromDateTime(DateTime.Today));
        RuleFor(x => x.Sex)
            .IsInEnum();
    }
}

[ExtendObjectType(GraphQlTypes.Mutation)]
public class RegisterUserMutation
{
    [Error<ValidationError>]
    [Error<RegistrationFailedError>]
    public async Task<MutationResult<Void>> RegisterUser(
        [Service] IIdentityService identityService,
        [Service] IValidator<RegisterUserInput> inputValidator,
        RegisterUserInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);

        if (validationResult.IsFailure)
        {
            return validationResult.ToMutationResult();
        }

        var registrationResult = await identityService.RegisterUserAsync(input, cancellationToken);
        return registrationResult.ToMutationResult();
    }
}