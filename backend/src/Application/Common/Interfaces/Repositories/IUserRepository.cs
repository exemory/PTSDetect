using Application.Infrastructure.Identity;

namespace Application.Common.Interfaces.Repositories;

public interface IUserRepository
{
    public Task AddRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken);
    public Task RemoveRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken);
    public Task<bool> CheckTokenExistence(string userId, Guid refreshTokenId, CancellationToken cancellationToken);
    public Task SaveGeneralTestResult(string userId, GeneralTestResult testResult, CancellationToken cancellationToken);

    public Task<IQueryable<Models.GeneralTestResult>> GetGeneralTestResults(string userId, string languageCode,
        CancellationToken cancellationToken);

    public Task<Models.GeneralTestResult?> GetGeneralTestResult(Guid resultId, string userId,
        string languageCode, CancellationToken cancellationToken);
}