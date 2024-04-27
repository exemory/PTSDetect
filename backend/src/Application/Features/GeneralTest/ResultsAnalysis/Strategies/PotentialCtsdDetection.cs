using Application.Common.Constants;
using Application.Features.GeneralTest.ResultsAnalysis.Interfaces;

namespace Application.Features.GeneralTest.ResultsAnalysis.Strategies;

public class PotentialCtsdDetection : IPotentialProblemsDetection
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

        var ctsdQuestionGroupSignal = test.QuestionGroups
            .First(x => x.Id == GeneralTestIdentifiers.CtsdQuestionGroupId)
            .Questions
            .Any(x =>
            {
                var answer = x.Answers.First(a => a.Id == answers[x.Id]);
                return answer.Tags.Contains(ProblemTags.ChronicTraumaticStressDisorder);
            });

        return ptsdQuestionGroupSignal && ctsdQuestionGroupSignal ? ProblemTags.ChronicTraumaticStressDisorder : null;
    }
}