using Application.Common.Interfaces.Repositories;
using Application.Infrastructure.Identity;
using Application.Infrastructure.Persistence.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;

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

    public async Task<bool> CheckTokenExistence(string userId, Guid refreshTokenId)
    {
        var filter = Builders<ApplicationUser>.Filter.And(
            Builders<ApplicationUser>.Filter
                .Eq(x => x.Id, ObjectId.Parse(userId)),
            Builders<ApplicationUser>.Filter
                .AnyIn(x => x.RefreshTokens, [refreshTokenId])
        );

        var count = await context.Users.CountDocumentsAsync(filter, new CountOptions {Limit = 1});
        return count > 0;
    }
}