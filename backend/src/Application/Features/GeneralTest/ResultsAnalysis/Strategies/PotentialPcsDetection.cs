using Application.Common.Constants;
using Application.Features.GeneralTest.ResultsAnalysis.Interfaces;

namespace Application.Features.GeneralTest.ResultsAnalysis.Strategies;

public class PotentialPcsDetection : IPotentialProblemsDetection
{
    private const int RequiredPcsAnswersCount = 3;

    public string? Analyse(Documents.GeneralTest test, IReadOnlyDictionary<Guid, Guid> answers)
    {
        var firstPcsGroupQuestions = test
            .QuestionGroups
            .First(x => x.Id == GeneralTestIdentifiers.PcsQuestionGroupId)
            .QuestionGroups
            .First()
            .Questions;

        var firstPcsGroupQuestionsSignal = firstPcsGroupQuestions
            .Any(x =>
            {
                var answer = x.Answers.First(a => a.Id == answers[a.Id]);
                return answer.Tags.Contains(ProblemTags.PostConcussionSyndrome);
            });

        var generalPcsSignal = test.QuestionGroups
            .SelectMany(x =>
                x.Questions.Union(x.QuestionGroups.SelectMany(y => y.Questions)))
            .Except(firstPcsGroupQuestions)
            .Count(x =>
            {
                var answer = x.Answers.First(y => y.Id == answers[x.Id]);
                return answer.Tags.Contains(ProblemTags.PostConcussionSyndrome);
            }) >= RequiredPcsAnswersCount;

        return firstPcsGroupQuestionsSignal && generalPcsSignal ? ProblemTags.PostConcussionSyndrome : null;
    }
}