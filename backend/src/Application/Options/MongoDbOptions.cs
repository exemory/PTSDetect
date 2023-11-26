namespace Application.Options;

public class MongoDbOptions
{
    public const string SectionName = "MongoDbOptions";

    public required string ConnectionString { get; set; }
    public required string AppDatabaseName { get; set; }
}