namespace Application.Options;

public class SendGridOptions
{
    public const string SectionName = "SendGridOptions";

    public required string ApiKey { get; set; }
    public required string VerifyEmailTemplateId { get; set; }
    public required string ResetPasswordTemplateId { get; set; }
}