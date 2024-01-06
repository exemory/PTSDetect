using Error = Application.Primitives.Error.Error;

namespace Application.Common.Errors;

public class AnswerNotProvidedError(Guid questionId) 
    : Error($"Question with id {questionId} doesn't have an answer")
{
    public Guid QuestionId { get; set; } = questionId;
}