using Application.Common.Constants;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDbGenericRepository.Models;

namespace Application.Documents;

public class GeneralTest : IDocument<string>
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = GeneralTestIdentifiers.TestId;

    public int Version { get; set; } = 1;
    public IList<string> AvailableTranslations { get; set; } = [];

    public required IList<QuestionGroup> QuestionGroups { get; set; }
}

public class QuestionGroup
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public IList<Question> Questions { get; set; } = [];
    public IList<QuestionGroup> QuestionGroups { get; set; } = [];
}

public class Question
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required IList<Answer> Answers { get; set; }

    public IDictionary<string, QuestionTranslation> Translations { get; set; } =
        new Dictionary<string, QuestionTranslation>();
}

public class QuestionTranslation
{
    public required string Title { get; set; }
}

public class Answer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public IList<string> Tags { get; set; } = [];

    public IDictionary<string, AnswerTranslation> Translations { get; set; } =
        new Dictionary<string, AnswerTranslation>();
}

public class AnswerTranslation
{
    public required string Title { get; set; }
}