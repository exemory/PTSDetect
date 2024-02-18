using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Extensions;
using Microsoft.AspNetCore.Identity;
using Result = Application.Primitives.Result;

namespace Application.Infrastructure.Identity;

public class IdentityService(
    UserManager<ApplicationUser> userManager) : IIdentityService
{
    public async Task<Result.Result<(string UserId, string UserEmail)>> RegisterUserAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        var user = new ApplicationUser(email);

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            return result.Errors.ToRegistrationFailedError();
        }

        return (user.Id.ToString(), user.Email!);
    }

    public async Task<Result.Result<string>> GenerateEmailVerificationTokenAsync(string email,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
        {
            return UserNotFoundError.ByEmail(email);
        }

        return await userManager.GenerateEmailConfirmationTokenAsync(user);
    }

    public async Task<Result.Result> VerifyEmailAsync(string userId, string token,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
        }

        var result = await userManager.ConfirmEmailAsync(user, token);
        if (!result.Succeeded)
        {
            return result.Errors.ToEmailVerificationFailedError();
        }

        return Result.Result.Success();
    }

    public async Task<Result.Result<LoggedInUserInfo>> LoginByPasswordAsync(
        string login,
        string password,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(login);
        if (user is null)
        {
            return new InvalidCredentialsError();
        }

        var isAbleToSignInResult = await IsAbleToSignIn(user);
        if (isAbleToSignInResult.IsFailure)
        {
            return isAbleToSignInResult.Errors;
        }

        var isPasswordCorrect = await userManager.CheckPasswordAsync(user, password);
        if (!isPasswordCorrect)
        {
            return new InvalidCredentialsError();
        }

        var userRoles = await GetUserRolesAsync(user);

        return new LoggedInUserInfo(
            user.Id.ToString()!,
            user.Email,
            userRoles
        );
    }

    public async Task<Result.Result<IList<string>>> GetUserRolesAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
        }

        return Result.Result.Success(await GetUserRolesAsync(user));
    }

    public async Task<Result.Result<bool>> IsEmailTakenAsync(string email,
        CancellationToken cancellationToken = default)
    {
        return await userManager.FindByEmailAsync(email) is not null;
    }

    public async Task<Result.Result<Common.Models.UserInfo>> GetUserInfoByIdAsync(string userId,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
        }

        return GetUserInfo(user);
    }

    public async Task<Result.Result<Common.Models.UserInfo>> GetUserInfoByEmailAsync(string userEmail,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(userEmail);
        if (user is null)
        {
            return UserNotFoundError.ByEmail(userEmail);
        }

        return GetUserInfo(user);
    }

    public async Task<Result.Result<string>> GeneratePasswordResetTokenAsync(string userEmail,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(userEmail);
        if (user is null)
        {
            return UserNotFoundError.ByEmail(userEmail);
        }

        return await userManager.GeneratePasswordResetTokenAsync(user);
    }

    public async Task<Result.Result<bool>> ValidateResetPasswordTokenAsync(string userId, string token,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
        }

        return await userManager.VerifyUserTokenAsync(
            user,
            userManager.Options.Tokens.PasswordResetTokenProvider,
            UserManager<ApplicationUser>.ResetPasswordTokenPurpose,
            token);
    }

    public async Task<Result.Result> ResetPasswordAsync(string userId, string token,
        string newPassword, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
        }

        var result = await userManager.ResetPasswordAsync(user, token, newPassword);
        if (!result.Succeeded)
        {
            return result.Errors.ToResetPasswordFailedError();
        }

        return Result.Result.Success();
    }

    private async Task<Result.Result> IsAbleToSignIn(ApplicationUser user)
    {
        var isEmailVerified = await userManager.IsEmailConfirmedAsync(user);
        if (!isEmailVerified)
        {
            return new EmailIsNotVerifiedError();
        }

        return Result.Result.Success();
    }

    private Task<IList<string>> GetUserRolesAsync(ApplicationUser user)
    {
        return userManager.GetRolesAsync(user);
    }

    private Common.Models.UserInfo GetUserInfo(ApplicationUser user)
    {
        PersonalInfo? personalUserInfo = null;

        if (user.UserInfo is not null)
        {
            personalUserInfo = new PersonalInfo(
                user.UserInfo.FirstName,
                user.UserInfo.LastName,
                user.UserInfo.Birthdate,
                user.UserInfo.Sex,
                user.UserInfo.IsMarried);
        }

        return new Common.Models.UserInfo(
            user.Id.ToString(),
            user.Email!,
            personalUserInfo
        );
    }
}