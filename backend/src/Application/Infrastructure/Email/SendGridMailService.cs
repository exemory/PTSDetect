using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Options;
using Application.Primitives.Result;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Application.Infrastructure.Email;

public class SendGridMailService : IMailService
{
    private ISendGridClient Client { get; set; }
    private EmailOptions EmailOptions { get; set; }
    private SendGridOptions SendGridOptions { get; set; }
    private ILogger<SendGridMailService> Logger { get; set; }

    public SendGridMailService(
        ISendGridClient client,
        IOptions<EmailOptions> emailOptions,
        IOptions<SendGridOptions> sendGridOptions,
        ILogger<SendGridMailService> logger)
    {
        Client = client;
        EmailOptions = emailOptions.Value;
        SendGridOptions = sendGridOptions.Value;
        Logger = logger;
    }

    public async Task<Result> SendVerificationEmailAsync(string userEmail, string? userName, string verificationLink,
        CancellationToken cancellationToken = default)
    {
        var from = new EmailAddress(EmailOptions.ServiceEmail, EmailOptions.ServiceName);
        var to = new EmailAddress(userEmail, userName);

        var message = MailHelper.CreateSingleTemplateEmail(from, to,
            SendGridOptions.VerifyEmailTemplateId,
            new Dictionary<string, string?>
            {
                { "verificationLink", verificationLink }
            }
        );

        return await SendEmailAsync(message, cancellationToken: cancellationToken);
    }

    public async Task<Result> SendResetPasswordEmailAsync(string userEmail, string? userName, string resetLink,
        CancellationToken cancellationToken = default)
    {
        var from = new EmailAddress(EmailOptions.ServiceEmail, EmailOptions.ServiceName);
        var to = new EmailAddress(userEmail, userName);

        var message = MailHelper.CreateSingleTemplateEmail(from, to,
            SendGridOptions.ResetPasswordTemplateId,
            new Dictionary<string, string?>
            {
                { "userName", userName },
                { "resetLink", resetLink }
            }
        );

        return await SendEmailAsync(message, cancellationToken: cancellationToken);
    }

    private async Task<Result> SendEmailAsync(SendGridMessage message, CancellationToken cancellationToken = default)
    {
        var result = await Client.SendEmailAsync(message, cancellationToken: cancellationToken);

        if (!result.IsSuccessStatusCode)
        {
            var errorBody = await result.Body.ReadAsStringAsync(cancellationToken);
            Logger.LogError("Failed to send an email. Status code: {StatusCode}. Body: {Body}",
                result.StatusCode, errorBody);

            return new InternalServerError();
        }

        return Result.Success();
    }
}