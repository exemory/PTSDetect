using MongoDB.Driver;
using MongoDbGenericRepository;

namespace Application.Infrastructure.Persistence;

public class CustomMongoDbContext : MongoDbContext
{
    public CustomMongoDbContext(IMongoDatabase mongoDatabase)
        : base(mongoDatabase)
    {
    }

    public CustomMongoDbContext(string connectionString, string databaseName)
        : base(connectionString, databaseName)
    {
    }

    public CustomMongoDbContext(string connectionString)
        : base(connectionString)
    {
    }

    public CustomMongoDbContext(MongoClient client, string databaseName)
        : base(client, databaseName)
    {
    }

    protected override void InitializeGuidRepresentation()
    {
    }
}