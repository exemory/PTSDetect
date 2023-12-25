namespace Application.Options;

public class AssetFilePaths
{
    public const string SectionName = "AssetFileNames";
    
    public required string GeneralTestFilePath { get; set; }
    public required string AdviceFilePath { get; set; }
}