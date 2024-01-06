namespace Application.Options;

public class AssetOptions
{
    public const string SectionName = "AssetOptions";

    public required string GeneralTestFilePath { get; set; }
    public required string AdviceFilePath { get; set; }
}