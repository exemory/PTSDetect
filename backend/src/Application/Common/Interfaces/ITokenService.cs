using Application.Common.Models;
using Result = Application.Primitives.Result;

namespace Application.Common.Interfaces;

public interface ITokenService
{
    public Task<Result.Result<TokenPair>> GenerateTokenPairAsync(string userId, IEnumerable<string> userRoles,
        CancellationToken cancellationToken);

    public Task<Result.Result<TokenPair>> RefreshAccessTokenAsync(string refreshToken,
        IEnumerable<string> userRoles, CancellationToken cancellationToken);

    public Task<Result.Result<string>> GetTokenOwnerIdAsync(string refreshToken,
        CancellationToken cancellationToken);
}