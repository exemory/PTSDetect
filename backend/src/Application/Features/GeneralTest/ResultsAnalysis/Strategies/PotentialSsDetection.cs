using Application.Common.Constants;
using Application.Features.GeneralTest.ResultsAnalysis.Interfaces;

namespace Application.Features.GeneralTest.ResultsAnalysis.Strategies;

public class PotentialSsDetection : IPotentialProblemsDetection
{
    public string? Analyse(Documents.GeneralTest test, IReadOnlyDictionary<Guid, Guid> answers)
    {
        var ssSignal = test.QuestionGroups
            .SelectMany(x =>
                x.Questions.Union(x.QuestionGroups.SelectMany(y => y.Questions)))
            .Any(x =>
            {
                var answer = x.Answers.First(y => y.Id == answers[x.Id]);
                return answer.Tags.Contains(ProblemTags.SuicideSyndrome);
            });

        return ssSignal ? ProblemTags.SuicideSyndrome : null;
    }
}