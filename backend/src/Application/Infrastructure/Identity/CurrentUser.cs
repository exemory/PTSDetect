using System.Security.Claims;
using Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Application.Infrastructure.Identity;

public class CurrentUser : ICurrentUser
{
    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        var httpContext = httpContextAccessor.HttpContext ??
                          throw new InvalidOperationException(
                              "Failed to construct CurrentUserProvider. HttpContext is null.");

        User = httpContext.User;

        Id = User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier)?.Value
             ?? throw new InvalidOperationException("User doesn't have an identifier claim.");
    }

    public string Id { get; }
    public ClaimsPrincipal User { get; }
}