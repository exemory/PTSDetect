using Application.Common.Constants;
using Application.Common.Interfaces;
using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Types;

namespace Application.Features.User;

[ExtendObjectType(GraphQlTypes.Query)]
public class GetUploadAvatarUrlQuery
{
    [Authorize]
    public async Task<GetUploadAvatarUrlPayload> GetUploadAvatarUrl(
        [Service] ICurrentUser currentUser,
        [Service] IUserService userService)
    {
        var result = await userService.GetUploadAvatarUrlAsync(currentUser.Id);
        return new GetUploadAvatarUrlPayload(result.Value.AvatarId, result.Value.Url.ToString());
    }
}

public record GetUploadAvatarUrlPayload(string AvatarId, string UploadUrl);