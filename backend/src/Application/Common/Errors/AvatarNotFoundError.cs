using Application.Features.User;
using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class AvatarNotFoundError(string avatarId)
    : Error($"Avatar with id {avatarId} is not found"),
        IGetUserAvatarUrlErrorUnion
{
    public string AvatarId { get; set; } = avatarId;
}