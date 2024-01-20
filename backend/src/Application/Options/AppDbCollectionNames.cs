namespace Application.Options;

public class AppDbCollectionNames
{
    public const string SectionName = "AppDbCollectionNames";

    public required string Users { get; set; }
    public required string Tests { get; set; }
    public required string Advice { get; set; }
}