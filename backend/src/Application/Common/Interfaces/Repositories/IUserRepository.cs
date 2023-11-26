namespace Application.Common.Interfaces.Repositories;

public interface IUserRepository
{
    public Task AddRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken);
    public Task RemoveRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken);
    public Task<bool> CheckTokenExistence(string userId, Guid refreshTokenId);
}