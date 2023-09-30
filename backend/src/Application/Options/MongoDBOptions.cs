namespace Application.Options;

public class MongoDBOptions
{
    public const string SectionName = "MongoDBOptions";
    
    public required string ConnectionString { get; set; }
    public required string DatabaseName { get; set; }
}