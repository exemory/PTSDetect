using Application.Infrastructure.Identity;
using Application.Infrastructure.Persistence.Interfaces;
using Application.Options;
using MongoDB.Driver;

namespace Application.Infrastructure.Persistence;

public class AppDbContext : IAppDbContext
{
    public IMongoDatabase AppDb { get; }
    public IMongoCollection<ApplicationUser> Users { get; }

    public AppDbContext(IMongoDatabase appDatabase, AppDbCollectionNames collectionNames)
    {
        AppDb = appDatabase;
        Users = AppDb.GetCollection<ApplicationUser>(collectionNames.Users);
    }

    public AppDbContext(IMongoClient client, string appDatabaseName, AppDbCollectionNames collectionNames)
        : this(client.GetDatabase(appDatabaseName), collectionNames)
    {
    }
}