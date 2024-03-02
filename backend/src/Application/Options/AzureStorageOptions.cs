namespace Application.Options;

public class AzureStorageOptions
{
    public static string SectionName = "AzureStorageOptions";

    public required string ConnectionString { get; set; }
    public required TimeSpan PreviewUrlExpirationTime { get; set; }
    public required TimeSpan UploadUrlExpirationTime { get; set; }
}