namespace Application.Features.GeneralTest.ResultsAnalysis.Interfaces;

public interface IPotentialProblemsDetection
{
    string? Analyse(Documents.GeneralTest test, IReadOnlyDictionary<Guid, Guid> answers);
}