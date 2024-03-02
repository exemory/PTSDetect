using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Infrastructure.Identity;
using Application.Options;
using Application.Primitives;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using UserInfo = Application.Common.Models.UserInfo;

namespace Application.Infrastructure.User;

public class UserService(
    UserManager<ApplicationUser> userManager,
    IFileService fileService,
    IOptions<FileContainerNames> fileContainerNamesOptions) : IUserService
{
    private readonly FileContainerNames _fileContainerNames = fileContainerNamesOptions.Value;

    public async Task<Result<UserInfo>> GetUserInfoByIdAsync(string userId,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
        }

        return GetUserInfo(user);
    }

    public async Task<Result<UserInfo>> GetUserInfoByEmailAsync(string userEmail,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(userEmail);
        if (user is null)
        {
            return UserNotFoundError.ByEmail(userEmail);
        }

        return GetUserInfo(user);
    }

    public async Task<Result<PersonalInfo>> UpdateUserPersonalInfoAsync(string userId,
        PersonalInfo personalInfo, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
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

    public async Task<Result<Uri>> GetAvatarUrlAsync(string userId,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ById(userId);
        }

        if (user.AvatarId is null)
        {
            return new UserDoesNotHaveAvatarError(userId);
        }

        if (!await fileService.ExistsAsync(_fileContainerNames.UserAvatars, user.AvatarId, cancellationToken))
        {
            return new AvatarNotFoundError(user.AvatarId);
        }

        return fileService.GeneratePreviewUrl(_fileContainerNames.UserAvatars, user.AvatarId);
    }

    public Task<Result<(string AvatarId, Uri Url)>> GetUploadAvatarUrlAsync(string userId,
        CancellationToken cancellationToken = default)
    {
        var avatarId = Guid.NewGuid().ToString();
        var url = fileService.GenerateUploadUrl(_fileContainerNames.UserAvatars, avatarId);

        return Task.FromResult(Result.Success((avatarId, url)));
    }

    public async Task<Result> UpdateAvatarAsync(string userId, string avatarId,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return UserNotFoundError.ByEmail(userId);
        }

        if (user.AvatarId == avatarId)
        {
            return Result.Success();
        }

        if (!await fileService.ExistsAsync(_fileContainerNames.UserAvatars, avatarId, cancellationToken))
        {
            return new AvatarNotFoundError(avatarId);
        }

        if (user.AvatarId is not null)
        {
            await fileService.DeleteAsync(_fileContainerNames.UserAvatars, user.AvatarId, cancellationToken);
        }

        user.AvatarId = avatarId;
        await userManager.UpdateAsync(user);

        return Result.Success();
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