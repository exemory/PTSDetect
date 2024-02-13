using Application.Primitives.Result;

namespace Application.Common.Interfaces;

public interface IMailService
{
    public Task<Result> SendResetPasswordEmailAsync(string userEmail, string? userName, string resetLink,
        CancellationToken cancellationToken = default);
}