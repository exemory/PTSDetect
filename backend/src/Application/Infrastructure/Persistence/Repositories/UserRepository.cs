using Application.Common.Interfaces.Repositories;
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
    public async Task AddRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken)
    {
        var filter = Builders<ApplicationUser>.Filter
            .Eq(x => x.Id, ObjectId.Parse(userId));

        var updateDefinition = Builders<ApplicationUser>.Update
            .Push(user => user.RefreshTokens, refreshTokenId);

        await context.Users.UpdateOneAsync(filter, updateDefinition, cancellationToken: cancellationToken);
    }

    public async Task RemoveRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken)
    {
        var filter = Builders<ApplicationUser>.Filter
            .Eq(x => x.Id, ObjectId.Parse(userId));

        var updateDefinition = Builders<ApplicationUser>.Update
            .Pull(user => user.RefreshTokens, refreshTokenId);

        await context.Users.UpdateOneAsync(filter, updateDefinition, cancellationToken: cancellationToken);
    }

    public async Task<bool> CheckTokenExistence(string userId, Guid refreshTokenId, CancellationToken cancellationToken)
    {
        var filter = Builders<ApplicationUser>.Filter.And(
            Builders<ApplicationUser>.Filter
                .Eq(x => x.Id, ObjectId.Parse(userId)),
            Builders<ApplicationUser>.Filter
                .AnyIn(x => x.RefreshTokens, [refreshTokenId])
        );

        var count = await context.Users.CountDocumentsAsync(filter, new CountOptions {Limit = 1},
            cancellationToken: cancellationToken);

        return count > 0;
    }

    public async Task SaveGeneralTestResult(string userId, GeneralTestResult testResult,
        CancellationToken cancellationToken)
    {
        var updateDefinition = Builders<ApplicationUser>.Update
            .Push(user => user.GeneralTestResults, testResult);

        await context.Users.UpdateOneAsync(x => x.Id == ObjectId.Parse(userId),
            updateDefinition, cancellationToken: cancellationToken);
    }

    public Task<IQueryable<Common.Models.GeneralTestResult>> GetGeneralTestResults(string userId, string languageCode,
        CancellationToken cancellationToken)
    {
        var testResultsWithAdvices = context.Users
            .AsQueryable()
            .Where(x => x.Id == ObjectId.Parse(userId))
            .SelectMany(x => x.GeneralTestResults)
            .SelectMany(testResult => testResult.PotentialProblems,
                (testResult, problem) => new {TestResult = testResult, Problem = problem})
            .Join(context.AdviceLists.AsQueryable(),
                testResult => testResult.Problem,
                adviceList => adviceList.Problem,
                (testResult, adviceList) => new {TestResult = testResult, AdviceList = adviceList})
            .GroupBy(testResultWithAdvices => testResultWithAdvices.TestResult.TestResult,
                testResult => testResult.AdviceList)
            .Select(testResultGroup =>
                new Common.Models.GeneralTestResult
                {
                    Id = testResultGroup.Key.Id,
                    CompletionDate = testResultGroup.Key.CompletionDate,
                    PotentialProblems = testResultGroup.Key.PotentialProblems,
                    AdviceLists = testResultGroup.Select(adviceList =>
                            new AdviceList
                            {
                                Problem = adviceList.Problem,
                                Advices = adviceList.Translations[languageCode].Advices
                            })
                        .ToList()
                });

        return Task.FromResult(testResultsWithAdvices);
    }

    public async Task<Common.Models.GeneralTestResult?> GetGeneralTestResult(Guid resultId, string userId,
        string languageCode, CancellationToken cancellationToken)
    {
        var queryableResults =
            (IMongoQueryable<Common.Models.GeneralTestResult>) await GetGeneralTestResults(userId, languageCode,
                cancellationToken);

        return await queryableResults
            .FirstOrDefaultAsync(x => x.Id == resultId, cancellationToken);
    }
}