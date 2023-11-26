using Application.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.AuthRequirements;

public class RefreshTokenRequirement : IAuthorizationRequirement;

public class RefreshTokenRequirementHandler(IHttpContextAccessor httpContextAccessor)
    : AuthorizationHandler<RefreshTokenRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
        RefreshTokenRequirement requirement)
    {
        var refreshToken = httpContextAccessor.HttpContext?.Request.GetRefreshToken();

        if (refreshToken is null)
        {
            context.Fail();
            return Task.CompletedTask;
        }

        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}