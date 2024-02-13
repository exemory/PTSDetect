using Application.Documents;
using Question = Application.Common.Models.Question;

namespace Application.Common.Interfaces.Repositories;

public interface ITestRepository
{
    public Task<bool> CheckGeneralTestExistence(CancellationToken cancellationToken = default);
    public Task<GeneralTest> GetGeneralTest(CancellationToken cancellationToken = default);
    public Task SaveGeneralTest(GeneralTest test, CancellationToken cancellationToken = default);
    public Task<IQueryable<Question>> GetGeneralTestQuestions(string languageCode, CancellationToken cancellationToken = default);
}