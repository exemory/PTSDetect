using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Extensions;
using FluentValidation;
using HotChocolate.Authorization;
using Microsoft.Extensions.Logging;

namespace Application.Features.User;

public record UpdateUserAvatarInput(string AvatarId);

public class UpdateUserAvatarInputValidator : AbstractValidator<UpdateUserAvatarInput>
{
    public UpdateUserAvatarInputValidator()
    {
        RuleFor(x => x.AvatarId)
            .NotEmpty();
    }
}

[ExtendObjectType(GraphQlTypes.Mutation)]
public class UpdateUserAvatarMutation
{
    [Authorize]
    [Error<ValidationError>]
    [Error<AvatarNotFoundError>]
    [Error<InternalServerError>]
    public async Task<MutationResult<UpdateUserAvatarPayload>> UpdateUserAvatar(
        [Service] IUserService userService,
        [Service] ICurrentUser currentUser,
        [Service] IValidator<UpdateUserAvatarInput> inputValidator,
        [Service] ILogger<UpdateUserInfoMutation> logger,
        UpdateUserAvatarInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return validationResult.Errors.ToMutationResult<UpdateUserAvatarPayload>();
        }

        var updateUserAvatarResult = await userService.UpdateAvatarAsync(currentUser.Id, input.AvatarId,
            cancellationToken);

        if (updateUserAvatarResult.IsFailure)
        {
            if (updateUserAvatarResult.Errors.OfType<UserNotFoundError>().Any())
            {
                logger.LogError("Unable to update user avatar. " +
                                "User with id {UserId} is not found", currentUser.Id);

                return new InternalServerError().ToMutationResult<UpdateUserAvatarPayload>();
            }

            return updateUserAvatarResult.Errors.ToMutationResult<UpdateUserAvatarPayload>();
        }

        var getUserAvatarResult = await userService.GetAvatarUrlAsync(currentUser.Id, cancellationToken);
        if (getUserAvatarResult.IsFailure)
        {
            return getUserAvatarResult.Errors.ToMutationResult<UpdateUserAvatarPayload>();
        }

        return new UpdateUserAvatarPayload(getUserAvatarResult.Value.ToString());
    }
}

public record UpdateUserAvatarPayload(string AvatarUrl);