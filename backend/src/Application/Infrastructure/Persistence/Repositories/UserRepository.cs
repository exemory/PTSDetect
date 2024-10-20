﻿using Application.Common.Interfaces.Repositories;
using Application.Common.Models;
using Application.Infrastructure.Identity;
using Application.Infrastructure.Persistence.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using GeneralTestResult = Application.Infrastructure.Identity.GeneralTestResult;

namespace Application.Infrastructure.Persistence.Repositories;

public class UserRepository(IAppDbContext context) : IUserRepository
{
    public async Task AddRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken = default)
    {
        var filter = Builders<ApplicationUser>.Filter
            .Eq(x => x.Id, ObjectId.Parse(userId));

        var updateDefinition = Builders<ApplicationUser>.Update
            .Push(user => user.RefreshTokens, refreshTokenId);

        await context.Users.UpdateOneAsync(filter, updateDefinition, cancellationToken: cancellationToken);
    }

    public async Task RemoveRefreshToken(string userId, Guid refreshTokenId,
        CancellationToken cancellationToken = default)
    {
        var filter = Builders<ApplicationUser>.Filter
            .Eq(x => x.Id, ObjectId.Parse(userId));

        var updateDefinition = Builders<ApplicationUser>.Update
            .Pull(user => user.RefreshTokens, refreshTokenId);

        await context.Users.UpdateOneAsync(filter, updateDefinition, cancellationToken: cancellationToken);
    }

    public async Task<bool> CheckTokenExistence(string userId, Guid refreshTokenId,
        CancellationToken cancellationToken = default)
    {
        var filter = Builders<ApplicationUser>.Filter.And(
            Builders<ApplicationUser>.Filter
                .Eq(x => x.Id, ObjectId.Parse(userId)),
            Builders<ApplicationUser>.Filter
                .AnyIn(x => x.RefreshTokens, [refreshTokenId])
        );

        var count = await context.Users.CountDocumentsAsync(filter, new CountOptions { Limit = 1 },
            cancellationToken: cancellationToken);

        return count > 0;
    }

    public async Task SaveGeneralTestResult(string userId, GeneralTestResult testResult,
        CancellationToken cancellationToken = default)
    {
        var updateDefinition = Builders<ApplicationUser>.Update
            .Push(user => user.GeneralTestResults, testResult);

        await context.Users.UpdateOneAsync(x => x.Id == ObjectId.Parse(userId),
            updateDefinition, cancellationToken: cancellationToken);
    }

    public async Task<IQueryable<Common.Models.GeneralTestResult>> GetGeneralTestResults(string userId,
        string languageCode, CancellationToken cancellationToken = default)
    {
        var testResults = await context.Users.AsQueryable()
            .Where(x => x.Id == ObjectId.Parse(userId))
            .SelectMany(x => x.GeneralTestResults)
            .ToListAsync(cancellationToken);

        var problems = testResults
            .SelectMany(x => x.PotentialProblems)
            .ToList();

        var adviceLists = await context.AdviceLists.AsQueryable()
            .Where(x => problems.Contains(x.Problem))
            .Select(x => new AdviceList
            {
                Problem = x.Problem,
                Advices = x.Translations[languageCode].Advices
            })
            .ToListAsync(cancellationToken);

        return testResults.Select(x => new Common.Models.GeneralTestResult
        {
            Id = x.Id,
            CompletionDate = x.CompletionDate,
            PotentialProblems = x.PotentialProblems,
            AdviceLists = adviceLists
                .Where(y => x.PotentialProblems.Contains(y.Problem))
                .ToList()
        }).AsQueryable();
    }

    public async Task<IQueryable<GeneralTestUserResults>> GetGeneralTestUsersResults(
        IList<string>? userIds, string languageCode, CancellationToken cancellationToken = default)
    {
        var userObjectIds = userIds?.Select(ObjectId.Parse).ToList();

        var testResultsQuery = context.Users.AsQueryable();

        if (userObjectIds != null)
        {
            testResultsQuery = testResultsQuery.Where(x => userObjectIds.Contains(x.Id));
        }

        var testResults = await testResultsQuery
            .Select(x => new
            {
                UserId = x.Id,
                x.GeneralTestResults
            })
            .ToListAsync(cancellationToken);

        var problems = testResults
            .SelectMany(x => x.GeneralTestResults)
            .SelectMany(x => x.PotentialProblems)
            .ToList();

        var adviceLists = await context.AdviceLists.AsQueryable()
            .Where(x => problems.Contains(x.Problem))
            .Select(x => new AdviceList
            {
                Problem = x.Problem,
                Advices = x.Translations[languageCode].Advices
            })
            .ToListAsync(cancellationToken);

        return testResults.Select(x => new GeneralTestUserResults()
        {
            UserId = x.UserId.ToString(),
            GeneralTestResults = x.GeneralTestResults
                .Select(y => new Common.Models.GeneralTestResult
                {
                    Id = y.Id,
                    CompletionDate = y.CompletionDate,
                    PotentialProblems = y.PotentialProblems,
                    AdviceLists = adviceLists
                        .Where(z => y.PotentialProblems.Contains(z.Problem))
                        .ToList()
                })
                .ToList()
        }).AsQueryable();
    }

    public async Task<Common.Models.GeneralTestResult?> GetUserGeneralTestResult(Guid resultId, string userId,
        string languageCode, CancellationToken cancellationToken = default)
    {
        var testResult = await context.Users.AsQueryable()
            .Where(x => x.Id == ObjectId.Parse(userId))
            .SelectMany(x => x.GeneralTestResults)
            .FirstOrDefaultAsync(x => x.Id == resultId, cancellationToken);

        if (testResult == null)
        {
            return null;
        }

        var adviceLists = await context.AdviceLists.AsQueryable()
            .Where(x => testResult.PotentialProblems.Contains(x.Problem))
            .Select(x => new AdviceList
            {
                Problem = x.Problem,
                Advices = x.Translations[languageCode].Advices
            })
            .ToListAsync(cancellationToken);

        return new Common.Models.GeneralTestResult
        {
            Id = testResult.Id,
            CompletionDate = testResult.CompletionDate,
            PotentialProblems = testResult.PotentialProblems,
            AdviceLists = adviceLists
        };
    }
    
    public async Task<Common.Models.GeneralTestResult?> GetGeneralTestResult(Guid resultId, string languageCode, 
        CancellationToken cancellationToken = default)
    {
        var testResult = await context.Users.AsQueryable()
            .SelectMany(x => x.GeneralTestResults)
            .FirstOrDefaultAsync(x => x.Id == resultId, cancellationToken);

        if (testResult == null)
        {
            return null;
        }

        var adviceLists = await context.AdviceLists.AsQueryable()
            .Where(x => testResult.PotentialProblems.Contains(x.Problem))
            .Select(x => new AdviceList
            {
                Problem = x.Problem,
                Advices = x.Translations[languageCode].Advices
            })
            .ToListAsync(cancellationToken);

        return new Common.Models.GeneralTestResult
        {
            Id = testResult.Id,
            CompletionDate = testResult.CompletionDate,
            PotentialProblems = testResult.PotentialProblems,
            AdviceLists = adviceLists
        };
    }
}