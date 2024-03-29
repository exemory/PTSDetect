﻿using Application.Common.Models;

namespace Application.Common.Interfaces.Repositories;

public interface IAdviceListRepository
{
    public Task<IQueryable<AdviceList>> GetAdviceLists(string languageCode, CancellationToken cancellationToken = default);
    public Task<bool> CheckAdviceListsExistence(CancellationToken cancellationToken = default);

    public Task SaveAdviceListsAsync(IEnumerable<Documents.AdviceList> adviceLists,
        CancellationToken cancellationToken = default);
}