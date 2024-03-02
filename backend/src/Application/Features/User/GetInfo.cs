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
        [Service] IUserService userService,
        CancellationToken cancellationToken = default)
    {
        var result = await userService.GetUserInfoByIdAsync(currentUser.Id, cancellationToken);
        return result.Value;
    }
}