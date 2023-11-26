using Application.Common.Models;
using Application.Features.Auth;
using Result = Application.Primitives.Result;

namespace Application.Common.Interfaces;

public interface IIdentityService
{
    public Task<Result.Result> RegisterUser(RegisterUserInput data,
        CancellationToken cancellationToken);

    public Task<Result.Result<LoggedInUserInfo>> LoginByPasswordAsync(string login, string password,
        CancellationToken cancellationToken);

    public Task<Result.Result<IList<string>>> GetUserRolesAsync(string userId,
        CancellationToken cancellationToken);
}