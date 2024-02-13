namespace Application.Options;

public class EmailOptions
{
    public const string SectionName = "EmailOptions";

    public required string ServiceEmail { get; set; }
    public required string ServiceName { get; set; }
}