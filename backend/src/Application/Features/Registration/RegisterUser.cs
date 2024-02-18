using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Extensions;
using Application.Options;
using FluentValidation;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Void = Application.ScalarTypes.Void;

namespace Application.Features.Registration;

public record RegisterUserInput(
    string Email,
    string Password);

public class RegisterUserInputValidator : AbstractValidator<RegisterUserInput>
{
    public RegisterUserInputValidator()
    {
        RuleFor(x => x.Email)
            .NotNull()
            .EmailAddress();
        RuleFor(x => x.Password)
            .NotEmpty();
    }
}

[ExtendObjectType(GraphQlTypes.Mutation)]
public class RegisterUserMutation
{
    [Error<ValidationError>]
    [Error<RegistrationFailedError>]
    [Error<InternalServerError>]
    public async Task<MutationResult<Void>> RegisterUser(
        [Service] IIdentityService identityService,
        [Service] IValidator<RegisterUserInput> inputValidator,
        [Service] IOptions<FrontendOptions> frontendOptions,
        [Service] IMailService mailService,
        [Service] ILogger<RegisterUserMutation> logger,
        RegisterUserInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);

        if (validationResult.IsFailure)
        {
            return validationResult.ToMutationResult();
        }

        var registrationResult = await identityService
            .RegisterUserAsync(input.Email, input.Password, cancellationToken);

        if (registrationResult.IsFailure)
        {
            return registrationResult.Errors.ToMutationResult();
        }

        var emailVerificationTokenResult = await identityService
            .GenerateEmailVerificationTokenAsync(input.Email, cancellationToken);

        if (emailVerificationTokenResult.IsFailure)
        {
            if (emailVerificationTokenResult.Errors.OfType<UserNotFoundError>().Any())
            {
                logger.LogError(
                    "Registered user is not found, failed to send verification email. " +
                    "User id: {UserId}, email: {UserEmail}", registrationResult.Value.UserId,
                    registrationResult.Value.UserEmail);
                return new InternalServerError().ToMutationResult();
            }

            return emailVerificationTokenResult.Errors.ToMutationResult();
        }

        var emailVerificationLink = $"{frontendOptions.Value.ResetPasswordUrl}" +
                                    $"?userId={registrationResult.Value.UserId}" +
                                    $"&token={emailVerificationTokenResult.Value}";

        var sendMailResult = await mailService.SendVerificationEmailAsync(
            registrationResult.Value.UserEmail,
            null,
            emailVerificationLink,
            cancellationToken);

        return sendMailResult.ToMutationResult();
    }
}