using Application.Common.Models;

namespace Application.Common.Interfaces;

public interface IUserService
{
    public Task<Primitives.Result.Result<UserInfo>> GetUserInfoByIdAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Primitives.Result.Result<UserInfo>> GetUserInfoByEmailAsync(string userId,
        CancellationToken cancellationToken = default);

    public Task<Primitives.Result.Result<PersonalInfo>> UpdateUserPersonalInfoAsync(string userId,
        PersonalInfo personalInfo, CancellationToken cancellationToken = default);
}