using Application.Common.Models;
using Application.Features.Registration;
using Result = Application.Primitives.Result;

namespace Application.Common.Interfaces;

public interface IIdentityService
{
    public Task<Result.Result> RegisterUserAsync(RegisterUserInput data,
        CancellationToken cancellationToken);

    public Task<Result.Result<LoggedInUserInfo>> LoginByPasswordAsync(string login, string password,
        CancellationToken cancellationToken);

    public Task<Result.Result<IList<string>>> GetUserRolesAsync(string userId,
        CancellationToken cancellationToken);

    public Task<Result.Result<bool>> IsEmailTakenAsync(string email,
        CancellationToken cancellationToken);

    public Task<Result.Result<UserInfo>> GetUserInfoAsync(string userId,
        CancellationToken cancellationToken);
}