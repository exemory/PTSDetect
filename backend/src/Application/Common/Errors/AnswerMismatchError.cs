using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class AnswerMismatchError(Guid questionId, Guid answerId)
    : Error($"Question with id {questionId} doesn't have the test answer with id {answerId}")
{
    public Guid QuestionId { get; set; } = questionId;
    public Guid AnswerId { get; set; } = answerId;
}