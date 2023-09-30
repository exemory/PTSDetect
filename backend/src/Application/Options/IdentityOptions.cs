namespace Application.Options;

public class IdentityOptions
{
    public const string SectionName = "IdentityOptions";

    public required bool RequireUniqueEmail { get; set; }
    public required byte RequiredPasswordLength { get; set; }
}
