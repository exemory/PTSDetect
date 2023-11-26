namespace Application.Common.Models;

public record LoggedInUserInfo(string Id, string? Username, string? Email, ICollection<string> Roles);