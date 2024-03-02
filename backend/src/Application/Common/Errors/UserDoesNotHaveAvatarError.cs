using Application.Features.User;
using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class UserDoesNotHaveAvatarError(string userId)
    : Error($"User with id {userId} does not have an avatar"),
        IGetUserAvatarUrlErrorUnion
{
    public string UserId { get; set; } = userId;
}