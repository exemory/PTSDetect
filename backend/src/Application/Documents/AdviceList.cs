using Application.Primitives;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Application.Documents;

public class AdviceList : IDocument<string>
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public int Version { get; set; } = 1;
    public required string Problem { get; set; }
    public IList<string> AvailableTranslations { get; set; } = [];

    public IDictionary<string, AdviceListTranslation> Translations { get; set; } =
        new Dictionary<string, AdviceListTranslation>();
}

public class AdviceListTranslation
{
    public required string[] Advices { get; set; }
}