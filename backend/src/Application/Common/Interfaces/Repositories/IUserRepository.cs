using Application.Infrastructure.Identity;

namespace Application.Common.Interfaces.Repositories;

public interface IUserRepository
{
    public Task AddRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken = default);
    public Task RemoveRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken = default);
    public Task<bool> CheckTokenExistence(string userId, Guid refreshTokenId, CancellationToken cancellationToken = default);
    public Task SaveGeneralTestResult(string userId, GeneralTestResult testResult, CancellationToken cancellationToken = default);

    public Task<IQueryable<Models.GeneralTestResult>> GetGeneralTestResults(string userId, string languageCode,
        CancellationToken cancellationToken = default);

    public Task<Models.GeneralTestResult?> GetGeneralTestResult(Guid resultId, string userId,
        string languageCode, CancellationToken cancellationToken = default);
}