﻿using Application.Common.Constants;
using Application.Common.Interfaces;
using Application.Common.Models;
using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Data;
using HotChocolate.Types;

namespace Application.Features.User;

[ExtendObjectType(GraphQlTypes.Query)]
public class UsersQuery
{
    [Authorize(Roles = [Roles.Administrator])]
    [UsePaging(IncludeTotalCount = true)]
    [UseFiltering]
    [UseSorting]
    public async Task<IList<UserInfo>> Users(
        [Service] IUserService userService,
        CancellationToken cancellationToken = default)
    {
        var result = await userService.GetUsersAsync(cancellationToken);
        return result.Value;
    }
}