using System.Text.Json;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Documents;
using Application.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Application.Infrastructure.Persistence;

public class DatabaseInitializer(
    IOptions<AssetFilePaths> options,
    ILogger<DatabaseInitializer> logger,
    ITestRepository testRepository) : IDatabaseInitializer
{
    private readonly AssetFilePaths _paths = options.Value;

    private readonly JsonSerializerOptions _jsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task InitializeDatabase(CancellationToken cancellationToken)
    {
        if (!await testRepository.CheckGeneralTestExistence(cancellationToken))
        {
            await using var fileStream = File.OpenRead(_paths.GeneralTestFilePath);

            var generalTest = await JsonSerializer.DeserializeAsync<GeneralTest>(fileStream, _jsonSerializerOptions,
                cancellationToken);

            if (generalTest == null)
            {
                logger.LogError("Failed to deserialize general test");
                throw new InvalidOperationException("Failed to deserialize general test.");
            }

            await testRepository.SaveGeneralTest(generalTest, cancellationToken);
        }
    }
}