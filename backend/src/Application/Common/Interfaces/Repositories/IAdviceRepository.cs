using Application.Common.Models;

namespace Application.Common.Interfaces.Repositories;

public interface IAdviceRepository
{
    public Task<IQueryable<Advice>> GetAdvice(string languageCode, CancellationToken cancellationToken);
    public Task<bool> CheckAdviceExistence(CancellationToken cancellationToken);
    public Task SaveAdviceAsync(IEnumerable<Documents.Advice> advice, CancellationToken cancellationToken);
}