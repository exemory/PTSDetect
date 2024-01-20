namespace Application.Features.GeneralTest.ResultsAnalysis.Interfaces;

public interface IGeneralTestAnswersProcessor
{
    public IList<string> Analyse(Documents.GeneralTest test, IReadOnlyDictionary<Guid, Guid> answers);
}