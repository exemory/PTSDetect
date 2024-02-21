using Application.Primitives.Result;

namespace Application.Common.Interfaces;

public interface IMailService
{
    public Task<Result> SendVerificationEmailAsync(string userEmail, string? userName, string verificationLink,
        CancellationToken cancellationToken = default);

    public Task<Result> SendResetPasswordEmailAsync(string userEmail, string? userName, string resetLink,
        CancellationToken cancellationToken = default);
}