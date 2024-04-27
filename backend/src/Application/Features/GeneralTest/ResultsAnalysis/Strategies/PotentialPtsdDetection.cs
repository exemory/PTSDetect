using Application.Common.Constants;
using Application.Features.GeneralTest.ResultsAnalysis.Interfaces;

namespace Application.Features.GeneralTest.ResultsAnalysis.Strategies;

public class PotentialPtsdDetection : IPotentialProblemsDetection
{
    public string? Analyse(Documents.GeneralTest test, IReadOnlyDictionary<Guid, Guid> answers)
    {
        var ptsdQuestionGroupSignal = test.QuestionGroups
            .First(x => x.Id == GeneralTestIdentifiers.PtsdQuestionGroupId)
            .QuestionGroups
            .All(x => x.Questions.Any(q =>
            {
                var answer = q.Answers.First(a => a.Id == answers[q.Id]);
                return answer.Tags.Contains(ProblemTags.PostTraumaticStressDisorder);
            }));

        return ptsdQuestionGroupSignal ? ProblemTags.PostTraumaticStressDisorder : null;
    }
}