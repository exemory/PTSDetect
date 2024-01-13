using Application.Documents;
using Question = Application.Common.Models.Question;

namespace Application.Common.Interfaces.Repositories;

public interface ITestRepository
{
    public Task<bool> CheckGeneralTestExistence(CancellationToken cancellationToken);
    public Task<GeneralTest> GetGeneralTest(CancellationToken cancellationToken);
    public Task SaveGeneralTest(GeneralTest test, CancellationToken cancellationToken);
    public Task<IQueryable<Question>> GetGeneralTestQuestions(string languageCode, CancellationToken cancellationToken);
}