using System.Security.Claims;

namespace Application.Common.Interfaces;

public interface ICurrentUser
{
    public string Id { get; }
    public ClaimsPrincipal User { get; }
    public bool IsAdmin { get; }
}