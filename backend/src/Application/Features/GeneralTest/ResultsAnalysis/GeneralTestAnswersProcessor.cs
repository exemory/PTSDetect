using System.Collections.Concurrent;
using Application.Features.GeneralTest.ResultsAnalysis.Interfaces;

namespace Application.Features.GeneralTest.ResultsAnalysis;

public class GeneralTestAnswersProcessor(IEnumerable<IPotentialProblemsDetection> problemDetectionStrategies)
    : IGeneralTestAnswersProcessor
{
    public IList<string> Analyse(Documents.GeneralTest test, IReadOnlyDictionary<Guid, Guid> answers)
    {
        var bag = new ConcurrentBag<string>();

        Parallel.ForEach(problemDetectionStrategies, strategy =>
        {
            var problem = strategy.Analyse(test, answers);
            if (problem is not null)
            {
                bag.Add(problem);
            }
        });

        return bag.ToList();
    }
}