using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class AnswersCountMismatchError(int providedAnswersCount, int testQuestionsCount)
    : Error($"Test contains {testQuestionsCount} questions, but {providedAnswersCount} answers received. " +
            $"The answers count must match the questions count")
{
    public int ProvidedAnswersCount { get; set; } = providedAnswersCount;
    public int TestQuestionsCount { get; set; } = testQuestionsCount;
}