using Application.Common.Models;
using Application.Primitives;

namespace Application.Common.Interfaces;

public interface IUserService
{
    public Task<Primitives.Result<UserInfo>> GetUserInfoByIdAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Primitives.Result<UserInfo>> GetUserInfoByEmailAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Primitives.Result<PersonalInfo>> UpdateUserPersonalInfoAsync(string userId,
        PersonalInfo personalInfo, CancellationToken cancellationToken = default);

    public Task<Primitives.Result<Uri>> GetAvatarUrlAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Primitives.Result<(string AvatarId, Uri Url)>> GetUploadAvatarUrlAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Result> UpdateAvatarAsync(string userId, string avatarId,
        CancellationToken cancellationToken = default);
    
    public Task<Result<IList<UserInfo>>> GetUsersAsync(CancellationToken cancellationToken = default);
}