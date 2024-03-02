using Application.Common.Models;
using Application.Primitives;

namespace Application.Common.Interfaces;

public interface ITokenService
{
    public Task<Result<TokenPair>> GenerateTokenPairAsync(string userId, IEnumerable<string> userRoles,
        CancellationToken cancellationToken = default);

    public Task<Result<TokenPair>> RefreshAccessTokenAsync(string refreshToken,
        IEnumerable<string> userRoles, CancellationToken cancellationToken = default);

    public Task<Result<string>> GetTokenOwnerIdAsync(string refreshToken,
        CancellationToken cancellationToken = default);
}