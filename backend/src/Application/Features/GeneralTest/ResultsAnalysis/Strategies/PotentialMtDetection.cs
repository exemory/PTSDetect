using Application.Common.Constants;
using Application.Features.GeneralTest.ResultsAnalysis.Interfaces;

namespace Application.Features.GeneralTest.ResultsAnalysis.Strategies;

public class PotentialMtDetection : IPotentialProblemsDetection
{
    public string? Analyse(Documents.GeneralTest test, IReadOnlyDictionary<Guid, Guid> answers)
    {
        var mtQuestionGroupSignal = test.QuestionGroups
            .First(x => x.Id == GeneralTestIdentifiers.MoralTraumaQuestionGroupId)
            .Questions
            .Any(x =>
            {
                var answer = x.Answers.First(y => y.Id == answers[x.Id]);
                return answer.Tags.Contains(ProblemTags.MoralTrauma);
            });

        var ptsdQuestionGroupSignal = test.QuestionGroups
            .First(x => x.Id == GeneralTestIdentifiers.PtsdQuestionGroupId)
            .QuestionGroups
            .Skip(1)
            .All(x => x.Questions.Any(q =>
            {
                var answer = q.Answers.First(a => a.Id == answers[a.Id]);
                return answer.Tags.Contains(ProblemTags.MoralTrauma);
            }));

        return mtQuestionGroupSignal && ptsdQuestionGroupSignal ? ProblemTags.MoralTrauma : null;
    }
}