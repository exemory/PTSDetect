using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;

namespace Application.Entities;

public class ApplicationUser : MongoIdentityUser<ObjectId>
{
    public ApplicationUser()
    {
    }

    public ApplicationUser(string userName, string email) : base(userName, email)
    {
    }

    public ApplicationUser(string userName) : base(userName)
    {
    }

    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}