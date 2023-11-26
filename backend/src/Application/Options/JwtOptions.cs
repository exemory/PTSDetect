namespace Application.Options;

public class JwtOptions
{
    public const string SectionName = "JwtOptions";
    public const string AuthSectionName = "JwtOptions:Auth";
    public const string RefreshSectionName = "JwtOptions:Refresh";

    public const string Auth = "Auth";
    public const string Refresh = "Refresh";

    public required string Secret { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
    public required TimeSpan Lifetime { get; set; }
    public required TimeSpan ClockSkew { get; set; }
}