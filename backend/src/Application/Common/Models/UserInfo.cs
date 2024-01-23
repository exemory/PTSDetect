using Application.Infrastructure.Identity;

namespace Application.Common.Models;

public record UserInfo(string Id, string Email, PersonalInfo? PersonalInfo);

public record PersonalInfo(
    string? FirstName,
    string? LastName,
    DateOnly Birthdate,
    Sex Sex,
    bool IsMarried);