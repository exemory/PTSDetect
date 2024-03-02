using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Extensions;
using HotChocolate.Authorization;
using Microsoft.Extensions.Logging;

namespace Application.Features.User;

[ExtendObjectType(GraphQlTypes.Query)]
public class UserAvatarQuery
{
    [Authorize]
    public async Task<GetUserAvatarUrlPayload> UserAvatar(
        [Service] ICurrentUser currentUser,
        [Service] IUserService userService,
        [Service] ILogger<UserAvatarQuery> logger,
        CancellationToken cancellationToken = default)
    {
        var result = await userService.GetAvatarUrlAsync(currentUser.Id, cancellationToken);

        if (result.IsFailure)
        {
            if (result.Errors.OfType<UserNotFoundError>().Any())
            {
                logger.LogError("Unable to retrieve user avatar. " +
                                "User with id {UserId} is not found", currentUser.Id);

                return new GetUserAvatarUrlPayload(
                    null,
                    [new InternalServerError()]
                );
            }

            return new GetUserAvatarUrlPayload(
                null,
                result.UnionErrors<IGetUserAvatarUrlErrorUnion>()
            );
        }

        return new GetUserAvatarUrlPayload(
            result.Value.ToString(),
            null
        );
    }
}

[UnionType("GetUserAvatarUrlErrorUnion")]
public interface IGetUserAvatarUrlErrorUnion;

public record GetUserAvatarUrlPayload(string? AvatarUrl, IEnumerable<IGetUserAvatarUrlErrorUnion>? Errors);