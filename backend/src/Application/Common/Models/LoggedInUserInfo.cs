namespace Application.Common.Models;

public record LoggedInUserInfo(string Id, string? Email, ICollection<string> Roles);