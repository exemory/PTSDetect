using Application.Infrastructure.Identity;
using Application.Infrastructure.Persistence.Interfaces;
using Application.Options;
using MongoDB.Driver;

namespace Application.Infrastructure.Persistence;

public class AppDbContext : IAppDbContext
{
    private readonly AppDbCollectionNames _collectionNames;

    public IMongoDatabase AppDb { get; }
    public IMongoCollection<ApplicationUser> Users { get; }

    IMongoCollection<T> IAppDbContext.Tests<T>() =>
        AppDb.GetCollection<T>(_collectionNames.Tests);

    public AppDbContext(IMongoDatabase appDatabase, AppDbCollectionNames collectionNames)
    {
        AppDb = appDatabase;
        _collectionNames = collectionNames;

        Users = AppDb.GetCollection<ApplicationUser>(_collectionNames.Users);
    }

    public AppDbContext(IMongoClient client, string appDatabaseName, AppDbCollectionNames collectionNames)
        : this(client.GetDatabase(appDatabaseName), collectionNames)
    {
    }
}