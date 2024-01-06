using System.Text.Json;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Documents;
using Application.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Application.Infrastructure.Persistence;

public class DatabaseInitializer(
    IOptions<AssetOptions> assetOptions,
    ILogger<DatabaseInitializer> logger,
    ITestRepository testRepository,
    IAdviceRepository adviceRepository) : IDatabaseInitializer
{
    private readonly AssetOptions _assetOptions = assetOptions.Value;

    private readonly JsonSerializerOptions _jsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task InitializeDatabase(CancellationToken cancellationToken)
    {
        if (!await testRepository.CheckGeneralTestExistence(cancellationToken))
        {
            await using var fileStream = File.OpenRead(_assetOptions.GeneralTestFilePath);

            var generalTest = await JsonSerializer.DeserializeAsync<GeneralTest>(fileStream, _jsonSerializerOptions,
                cancellationToken);

            if (generalTest == null)
            {
                logger.LogError("Failed to deserialize general test");
                throw new InvalidOperationException("Failed to deserialize general test.");
            }

            await testRepository.SaveGeneralTest(generalTest, cancellationToken);
        }

        if (!await adviceRepository.CheckAdviceExistence(cancellationToken))
        {
            await using var fileStream = File.OpenRead(_assetOptions.AdviceFilePath);

            var advice = await JsonSerializer.DeserializeAsync<IEnumerable<Advice>>(fileStream, _jsonSerializerOptions,
                cancellationToken);

            if (advice == null)
            {
                logger.LogError("Failed to deserialize advice");
                throw new InvalidOperationException("Failed to deserialize advice.");
            }

            await adviceRepository.SaveAdviceAsync(advice, cancellationToken);
        }
    }
}