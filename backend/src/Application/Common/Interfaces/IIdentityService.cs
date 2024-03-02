using Application.Common.Models;
using Application.Primitives;

namespace Application.Common.Interfaces;

public interface IIdentityService
{
    public Task<Result<(string UserId, string UserEmail)>> RegisterUserAsync(string email, string password,
        CancellationToken cancellationToken = default);

    public Task<Result<string>> GenerateEmailVerificationTokenAsync(string email,
        CancellationToken cancellationToken = default);

    public Task<Result> VerifyEmailAsync(string userId, string token,
        CancellationToken cancellationToken = default);

    public Task<Result<LoggedInUserInfo>> LoginByPasswordAsync(string login, string password,
        CancellationToken cancellationToken = default);

    public Task<Result<IList<string>>> GetUserRolesAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Result<bool>> IsEmailTakenAsync(string email,
        CancellationToken cancellationToken = default);

    public Task<Result<string>> GeneratePasswordResetTokenAsync(string userEmail,
        CancellationToken cancellationToken = default);

    public Task<Result<bool>> ValidateResetPasswordTokenAsync(string userId, string token,
        CancellationToken cancellationToken = default);

    public Task<Result> ResetPasswordAsync(string userId, string token, string newPassword,
        CancellationToken cancellationToken = default);
}