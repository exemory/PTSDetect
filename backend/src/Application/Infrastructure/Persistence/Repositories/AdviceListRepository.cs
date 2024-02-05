using Application.Common.Interfaces.Repositories;
using Application.Documents;
using Application.Infrastructure.Persistence.Interfaces;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Application.Infrastructure.Persistence.Repositories;

public class AdviceListRepository(IAppDbContext context) : IAdviceListRepository
{
    public Task<IQueryable<Common.Models.AdviceList>> GetAdviceLists(string languageCode, CancellationToken cancellationToken)
    {
        var adviceLists = context.AdviceLists
            .AsQueryable()
            .Select(x =>
                new Common.Models.AdviceList
                {
                    Problem = x.Problem,
                    Advices = x.Translations[languageCode].Advices
                });

        return Task.FromResult((IQueryable<Common.Models.AdviceList>) adviceLists);
    }

    public async Task<bool> CheckAdviceListsExistence(CancellationToken cancellationToken)
    {
        var adviceListsCount = await context.AdviceLists.CountDocumentsAsync(Builders<AdviceList>.Filter.Empty,
            new CountOptions {Limit = 1},
            cancellationToken: cancellationToken);

        return adviceListsCount > 0;
    }

    public Task SaveAdviceListsAsync(IEnumerable<AdviceList> adviceLists, CancellationToken cancellationToken)
    {
        return context.AdviceLists.InsertManyAsync(adviceLists, cancellationToken: cancellationToken);
    }
}