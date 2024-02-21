using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Result = Application.Primitives.Result;
using UserInfo = Application.Common.Models.UserInfo;

namespace Application.Infrastructure.User;

public class UserService(UserManager<ApplicationUser> userManager) : IUserService
{
    public async Task<Result.Result<UserInfo>> GetUserInfoByIdAsync(string userId,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
        }

        return GetUserInfo(user);
    }

    public async Task<Result.Result<UserInfo>> GetUserInfoByEmailAsync(string userEmail,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(userEmail);
        if (user is null)
        {
            return UserNotFoundError.ByEmail(userEmail);
        }

        return GetUserInfo(user);
    }

    public async Task<Result.Result<PersonalInfo>> UpdateUserPersonalInfoAsync(string userId,
        PersonalInfo personalInfo, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ByEmail(userId);
        }

        user.UserInfo = new Identity.UserInfo
        {
            FirstName = personalInfo.FirstName,
            LastName = personalInfo.LastName,
            Birthdate = personalInfo.Birthdate,
            IsMarried = personalInfo.IsMarried,
            Sex = personalInfo.Sex
        };

        await userManager.UpdateAsync(user);
        return personalInfo;
    }

    private UserInfo GetUserInfo(ApplicationUser user)
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

        return new UserInfo(
            user.Id.ToString(),
            user.Email!,
            personalUserInfo
        );
    }
}