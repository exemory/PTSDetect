using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Extensions;
using Application.Infrastructure.Identity;
using FluentValidation;
using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Types;
using Microsoft.Extensions.Logging;

namespace Application.Features.User;

public record UpdateUserInfoInput(
    string? Firstname,
    string? Lastname,
    DateOnly? Birthdate,
    Sex? Sex,
    bool? IsMarried);

public class UpdateUserInfoInputValidator : AbstractValidator<UpdateUserInfoInput>
{
    public UpdateUserInfoInputValidator()
    {
        RuleFor(x => x.Firstname)
            .Length(1, 100);
        RuleFor(x => x.Lastname)
            .Length(1, 100);
        RuleFor(x => x.Birthdate)
            .InclusiveBetween(new DateOnly(1900, 1, 1), DateOnly.FromDateTime(DateTime.Today));
        RuleFor(x => x.Sex)
            .IsInEnum();
    }
}

[ExtendObjectType(GraphQlTypes.Mutation)]
public class UpdateUserInfoMutation
{
    [Authorize]
    [Error<ValidationError>]
    [Error<InternalServerError>]
    public async Task<MutationResult<PersonalInfo>> UpdateUserInfo(
        [Service] IUserService userService,
        [Service] ICurrentUser currentUser,
        [Service] IValidator<UpdateUserInfoInput> inputValidator,
        [Service] ILogger<UpdateUserInfoMutation> logger,
        UpdateUserInfoInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return validationResult.Errors.ToMutationResult<PersonalInfo>();
        }

        var result = await userService.UpdateUserPersonalInfoAsync(
            currentUser.Id,
            new PersonalInfo(
                input.Firstname,
                input.Lastname,
                input.Birthdate,
                input.Sex,
                input.IsMarried
            ),
            cancellationToken);

        if (result.IsFailure)
        {
            if (result.Errors.OfType<UserNotFoundError>().Any())
            {
                logger.LogError(
                    "Unable to update user personal information. " +
                    "User with id {UserId} is not found", currentUser.Id);

                return new InternalServerError().ToMutationResult<PersonalInfo>();
            }

            return result.Errors.ToMutationResult<PersonalInfo>();
        }

        return result.ToMutationResult();
    }
}