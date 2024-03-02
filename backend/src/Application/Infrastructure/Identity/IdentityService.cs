using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Extensions;
using Application.Primitives;
using Microsoft.AspNetCore.Identity;

namespace Application.Infrastructure.Identity;

public class IdentityService(
    UserManager<ApplicationUser> userManager) : IIdentityService
{
    public async Task<Result<(string UserId, string UserEmail)>> RegisterUserAsync(
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

    public async Task<Result<string>> GenerateEmailVerificationTokenAsync(string email,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
        {
            return UserNotFoundError.ByEmail(email);
        }

        return await userManager.GenerateEmailConfirmationTokenAsync(user);
    }

    public async Task<Result> VerifyEmailAsync(string userId, string token,
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

        return Result.Success();
    }

    public async Task<Result<LoggedInUserInfo>> LoginByPasswordAsync(
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

    public async Task<Result<IList<string>>> GetUserRolesAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
        }

        return Result.Success(await GetUserRolesAsync(user));
    }

    public async Task<Result<bool>> IsEmailTakenAsync(string email,
        CancellationToken cancellationToken = default)
    {
        return await userManager.FindByEmailAsync(email) is not null;
    }

    public async Task<Result<string>> GeneratePasswordResetTokenAsync(string userEmail,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(userEmail);
        if (user is null)
        {
            return UserNotFoundError.ByEmail(userEmail);
        }

        return await userManager.GeneratePasswordResetTokenAsync(user);
    }

    public async Task<Result<bool>> ValidateResetPasswordTokenAsync(string userId, string token,
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

    public async Task<Result> ResetPasswordAsync(string userId, string token,
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

        return Result.Success();
    }

    private async Task<Result> IsAbleToSignIn(ApplicationUser user)
    {
        var isEmailVerified = await userManager.IsEmailConfirmedAsync(user);
        if (!isEmailVerified)
        {
            return new EmailIsNotVerifiedError();
        }

        return Result.Success();
    }

    private Task<IList<string>> GetUserRolesAsync(ApplicationUser user)
    {
        return userManager.GetRolesAsync(user);
    }
}