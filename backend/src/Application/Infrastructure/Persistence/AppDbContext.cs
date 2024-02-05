using Application.Documents;
using Application.Infrastructure.Identity;
using Application.Infrastructure.Persistence.Interfaces;
using Application.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.Core.Configuration;

namespace Application.Infrastructure.Persistence;

public class AppDbContext : IAppDbContext
{
    private readonly AppDbCollectionNames _collectionNames;

    public IMongoDatabase AppDb { get; }
    public IMongoCollection<ApplicationUser> Users { get; }

    IMongoCollection<T> IAppDbContext.Tests<T>() =>
        AppDb.GetCollection<T>(_collectionNames.Tests);

    public IMongoCollection<AdviceList> AdviceLists { get; set; }

    public AppDbContext(IOptions<MongoDbOptions> mongoOptions,
        IOptions<AppDbCollectionNames> collectionNames,
        ILoggerFactory loggerFactory)
    {
        _collectionNames = collectionNames.Value;

        var mongoSettings = MongoClientSettings.FromConnectionString(mongoOptions.Value.ConnectionString);
        mongoSettings.LoggingSettings = new LoggingSettings(loggerFactory, int.MaxValue);

        var mongoClient = new MongoClient(mongoSettings);

        AppDb = mongoClient.GetDatabase(mongoOptions.Value.AppDatabaseName);
        Users = AppDb.GetCollection<ApplicationUser>(_collectionNames.Users);
        AdviceLists = AppDb.GetCollection<AdviceList>(_collectionNames.AdviceLists);
    }
}