using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;

namespace Application.Entities;

public sealed class ApplicationUser : MongoIdentityUser<ObjectId>
{
    #region Constructors

    public ApplicationUser()
    {
    }

    public ApplicationUser(string userName, string email) : base(userName, email)
    {
    }

    public ApplicationUser(string userName) : base(userName)
    {
    }

    #endregion

    public UserInfo? UserInfo { get; set; }
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