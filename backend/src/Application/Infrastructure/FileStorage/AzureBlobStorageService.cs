using Application.Common.Interfaces;
using Application.Options;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.Extensions.Options;

namespace Application.Infrastructure.FileStorage;

public class AzureBlobStorageService(
    BlobServiceClient blobServiceClient,
    IOptions<AzureStorageOptions> options)
    : IFileService
{
    private readonly AzureStorageOptions _options = options.Value;

    public Uri GeneratePreviewUrl(string container, string fileKey)
    {
        var expiresOn = DateTimeOffset.UtcNow.Add(_options.PreviewUrlExpirationTime);

        return blobServiceClient
            .GetBlobContainerClient(container)
            .GetBlobClient(fileKey)
            .GenerateSasUri(BlobSasPermissions.Read, expiresOn);
    }

    public Uri GenerateUploadUrl(string container, string fileKey)
    {
        var expiresOn = DateTimeOffset.UtcNow.Add(_options.UploadUrlExpirationTime);

        return blobServiceClient
            .GetBlobContainerClient(container)
            .GetBlobClient(fileKey)
            .GenerateSasUri(BlobSasPermissions.Write, expiresOn);
    }

    public Task DeleteAsync(string container, string fileKey, CancellationToken cancellationToken = default)
    {
        return blobServiceClient
            .GetBlobContainerClient(container)
            .GetBlobClient(fileKey)
            .DeleteIfExistsAsync(cancellationToken: cancellationToken);
    }

    public async Task<bool> ExistsAsync(string container, string fileKey, CancellationToken cancellationToken = default)
    {
        var response = await blobServiceClient
            .GetBlobContainerClient(container)
            .GetBlobClient(fileKey)
            .ExistsAsync(cancellationToken);

        return response.Value;
    }
}