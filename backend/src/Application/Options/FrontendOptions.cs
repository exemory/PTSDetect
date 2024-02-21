namespace Application.Options;

public class FrontendOptions
{
    public const string SectionName = "FrontendOptions";

    public required string BaseUrl { get; set; }
    public required string VerifyEmailPath { get; set; }
    public required string ResetPasswordPath { get; set; }

    public string VerifyEmailUrl => $"{BaseUrl}{VerifyEmailPath}";
    public string ResetPasswordUrl => $"{BaseUrl}{ResetPasswordPath}";
}