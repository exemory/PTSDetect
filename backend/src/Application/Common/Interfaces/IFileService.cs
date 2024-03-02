namespace Application.Common.Interfaces;

public interface IFileService
{
    public Uri GeneratePreviewUrl(string container, string fileKey);
    public Uri GenerateUploadUrl(string container, string fileKey);

    public Task DeleteAsync(string container, string fileKey,
        CancellationToken cancellationToken = default);

    public Task<bool> ExistsAsync(string container, string fileKey,
        CancellationToken cancellationToken = default);
}