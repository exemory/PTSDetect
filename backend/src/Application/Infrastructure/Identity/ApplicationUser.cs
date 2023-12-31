﻿using Application.Common.Interfaces.Primitives;
using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;

namespace Application.Infrastructure.Identity;

public sealed class ApplicationUser : MongoIdentityUser<ObjectId>, IDocument<ObjectId>
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
    public ICollection<Guid> RefreshTokens { get; set; } = new List<Guid>();
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