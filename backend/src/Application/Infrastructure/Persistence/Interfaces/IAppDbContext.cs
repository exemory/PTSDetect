using Application.Infrastructure.Identity;
using MongoDB.Driver;

namespace Application.Infrastructure.Persistence.Interfaces;

public interface IAppDbContext
{
    public IMongoDatabase AppDb { get; }

    public IMongoCollection<ApplicationUser> Users { get; }
}