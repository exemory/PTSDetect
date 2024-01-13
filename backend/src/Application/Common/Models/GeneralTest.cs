using MongoDB.Bson;

namespace Application.Common.Models;

public class GeneralTest
{
    public required ObjectId Id { get; set; }
    public required IList<string> AvailableTranslations { get; set; } = [];

    public required IList<QuestionsGroup> QuestionsGroups { get; set; }
}

public class QuestionsGroup
{
    public required Guid Id { get; set; }
    public required IList<Question> Questions { get; set; }
    public required IList<QuestionsGroup> QuestionsGroups { get; set; }
}

public class Question
{
    public required Guid Id { get; set; }
    public required IList<Answer> Answers { get; set; }
    public required string Title { get; set; }
}

public class Answer
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
}