using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Extensions;
using Application.Features.Registration;
using Microsoft.AspNetCore.Identity;
using Result = Application.Primitives.Result;

namespace Application.Infrastructure.Identity;

public class IdentityService(UserManager<ApplicationUser> userManager) : IIdentityService
{
    public async Task<Result.Result> RegisterUserAsync(
        RegisterUserInput data,
        CancellationToken cancellationToken)
    {
        var user = new ApplicationUser(data.Email)
        {
            UserInfo = new UserInfo
            {
                FirstName = data.Firstname,
                LastName = data.Lastname,
                Birthdate = data.Birthdate,
                Sex = data.Sex,
                IsMarried = data.IsMarried
            }
        };

        var result = await userManager.CreateAsync(user, data.Password);

        if (!result.Succeeded)
        {
            return result.Errors.ToError();
        }

        return Result.Result.Success();
    }

    public async Task<Result.Result<LoggedInUserInfo>> LoginByPasswordAsync(
        string login,
        string password,
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(login);

        if (user is null)
        {
            return new InvalidCredentialsError();
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
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            return new UserNotFoundError(userId);
        }

        return Result.Result.Success(await GetUserRolesAsync(user));
    }

    public async Task<Result.Result<bool>> IsEmailTakenAsync(string email, CancellationToken cancellationToken)
    {
        return await userManager.FindByEmailAsync(email) is not null;
    }

    public async Task<Result.Result<Common.Models.UserInfo>> GetUserInfoAsync(string userId,
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            return new UserNotFoundError(userId);
        }

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

    private Task<IList<string>> GetUserRolesAsync(ApplicationUser user)
    {
        return userManager.GetRolesAsync(user);
    }
}