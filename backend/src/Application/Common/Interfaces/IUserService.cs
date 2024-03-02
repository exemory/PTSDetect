using Application.Common.Models;
using Application.Primitives.Result;

namespace Application.Common.Interfaces;

public interface IUserService
{
    public Task<Primitives.Result.Result<UserInfo>> GetUserInfoByIdAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Primitives.Result.Result<UserInfo>> GetUserInfoByEmailAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Primitives.Result.Result<PersonalInfo>> UpdateUserPersonalInfoAsync(string userId,
        PersonalInfo personalInfo, CancellationToken cancellationToken = default);

    public Task<Primitives.Result.Result<Uri>> GetAvatarUrlAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Primitives.Result.Result<(string AvatarId, Uri Url)>> GetUploadAvatarUrlAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Result> UpdateAvatarAsync(string userId, string avatarId,
        CancellationToken cancellationToken = default);
}