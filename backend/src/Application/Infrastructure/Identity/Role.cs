using Application.Common.Interfaces.Primitives;
using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;

namespace Application.Infrastructure.Identity;

public sealed class Role : MongoIdentityRole<ObjectId>, IDocument<ObjectId>
{
    public Role()
    {
    }

    public Role(string roleName) : base(roleName)
    {
    }
}