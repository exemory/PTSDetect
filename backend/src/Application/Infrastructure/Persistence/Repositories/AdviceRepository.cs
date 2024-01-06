using Application.Common.Interfaces.Repositories;
using Application.Documents;
using Application.Infrastructure.Persistence.Interfaces;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Application.Infrastructure.Persistence.Repositories;

public class AdviceRepository(IAppDbContext context) : IAdviceRepository
{
    public Task<IQueryable<Common.Models.Advice>> GetAdvice(string languageCode, CancellationToken cancellationToken)
    {
        var advice = context.Advice
            .AsQueryable()
            .Select(x =>
                new Common.Models.Advice
                {
                    Problem = x.Problem,
                    Text = x.Translations[languageCode].Text
                });

        return Task.FromResult((IQueryable<Common.Models.Advice>) advice);
    }

    public async Task<bool> CheckAdviceExistence(CancellationToken cancellationToken)
    {
        var adviceCount = await context.Advice.CountDocumentsAsync(Builders<Advice>.Filter.Empty,
            cancellationToken: cancellationToken);

        return adviceCount > 0;
    }

    public Task SaveAdviceAsync(IEnumerable<Advice> advice, CancellationToken cancellationToken)
    {
        return context.Advice.InsertManyAsync(advice, cancellationToken: cancellationToken);
    }
}