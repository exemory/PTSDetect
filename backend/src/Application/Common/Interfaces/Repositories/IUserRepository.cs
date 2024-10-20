using Application.Common.Models;
using GeneralTestResult = Application.Infrastructure.Identity.GeneralTestResult;

namespace Application.Common.Interfaces.Repositories;

public interface IUserRepository
{
    public Task AddRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken = default);
    public Task RemoveRefreshToken(string userId, Guid refreshTokenId, CancellationToken cancellationToken = default);
    public Task<bool> CheckTokenExistence(string userId, Guid refreshTokenId, CancellationToken cancellationToken = default);
    public Task SaveGeneralTestResult(string userId, GeneralTestResult testResult, CancellationToken cancellationToken = default);

    public Task<IQueryable<Models.GeneralTestResult>> GetGeneralTestResults(string userId, string languageCode,
        CancellationToken cancellationToken = default);

    public Task<IQueryable<GeneralTestUserResults>> GetGeneralTestUsersResults(IList<string>? userIds,
        string languageCode, CancellationToken cancellationToken = default);

    public Task<Models.GeneralTestResult?> GetUserGeneralTestResult(Guid resultId, string userId,
        string languageCode, CancellationToken cancellationToken = default);
    
    public Task<Models.GeneralTestResult?> GetGeneralTestResult(Guid resultId, string languageCode, 
        CancellationToken cancellationToken = default);
}