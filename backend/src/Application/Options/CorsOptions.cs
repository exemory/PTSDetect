namespace Application.Options;

public class CorsOptions
{
    public const string SectionName = "CorsOptions";

    public required string[] AllowedOrigins { get; set; }
    public required string[] AllowedMethods { get; set; }
}