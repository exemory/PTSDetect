﻿using Application.Common.Models;
using Application.Features.Registration;
using Result = Application.Primitives.Result;

namespace Application.Common.Interfaces;

public interface IIdentityService
{
    public Task<Result.Result> RegisterUserAsync(RegisterUserInput data,
        CancellationToken cancellationToken = default);

    public Task<Result.Result<LoggedInUserInfo>> LoginByPasswordAsync(string login, string password,
        CancellationToken cancellationToken = default);

    public Task<Result.Result<IList<string>>> GetUserRolesAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Result.Result<bool>> IsEmailTakenAsync(string email,
        CancellationToken cancellationToken = default);

    public Task<Result.Result<UserInfo>> GetUserInfoByIdAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Result.Result<UserInfo>> GetUserInfoByEmailAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Result.Result<string>> GeneratePasswordResetTokenAsync(string userEmail,
        CancellationToken cancellationToken = default);

    public Task<Result.Result<bool>> ValidateResetPasswordTokenAsync(string userId, string token,
        CancellationToken cancellationToken = default);

    public Task<Result.Result> ResetPasswordAsync(string userId, string token, string newPassword,
        CancellationToken cancellationToken = default);
}