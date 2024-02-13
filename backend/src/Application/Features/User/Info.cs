using Application.Common.Constants;
using Application.Common.Interfaces;
using Application.Common.Models;
using HotChocolate.Authorization;

namespace Application.Features.User;

[ExtendObjectType(GraphQlTypes.Query)]
public class UserInfoQuery
{
    [Authorize]
    public async Task<UserInfo> UserInfo(
        [Service] ICurrentUser currentUser,
        [Service] IIdentityService identityService,
        CancellationToken cancellationToken = default)
    {
        var result = await identityService.GetUserInfoByIdAsync(currentUser.Id, cancellationToken);
        return result.Value;
    }
}