using Application.Primitives;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Application.Documents;

public class Advice : IDocument<string>
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public int Version { get; set; } = 1;
    public required string Problem { get; set; }
    public IList<string> AvailableTranslations { get; set; } = [];

    public IDictionary<string, AdviceTranslation> Translations { get; set; } =
        new Dictionary<string, AdviceTranslation>();
}

public class AdviceTranslation
{
    public required string Text { get; set; }
}