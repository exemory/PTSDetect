using Application.Common.Models;
using Application.Primitives;
using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;

namespace Application.Infrastructure.Identity;

public sealed class ApplicationUser : MongoIdentityUser<ObjectId>, IDocument<ObjectId>
{
    #region Constructors

    public ApplicationUser()
    {
    }

    public ApplicationUser(string email)
        : base(Guid.NewGuid().ToString(), email)
    {
    }

    #endregion

    public UserInfo? UserInfo { get; set; }
    public IList<Guid> RefreshTokens { get; set; } = [];
    public IList<GeneralTestResult> GeneralTestResults { get; set; } = [];
}

public sealed class UserInfo
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public required DateOnly Birthdate { get; set; }
    public required Sex Sex { get; set; }
    public required bool IsMarried { get; set; }
}

public enum Sex : byte
{
    Male = 0,
    Female = 1
}

public sealed class GeneralTestResult
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required DateTimeOffset CompletionDate { get; set; }
    public required IList<string> PotentialProblems { get; set; }
    public required IList<AnsweredQuestion> Answers { get; set; }
}