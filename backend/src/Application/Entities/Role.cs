using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;

namespace Application.Entities;

public sealed class Role : MongoIdentityRole<ObjectId>
{
    public Role()
    {
    }

    public Role(string roleName) : base(roleName)
    {
    }
}