﻿using System.Text.Json;
using Application.Common.Constants;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Documents;
using Application.Infrastructure.Identity;
using Application.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Application.Infrastructure.Persistence;

public class DatabaseInitializer(
    IOptions<AssetOptions> assetOptions,
    ILogger<DatabaseInitializer> logger,
    ITestRepository testRepository,
    IAdviceListRepository adviceListRepository,
    RoleManager<Role> roleManager) : IDatabaseInitializer
{
    private readonly AssetOptions _assetOptions = assetOptions.Value;

    private readonly JsonSerializerOptions _jsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task InitializeDatabase(CancellationToken cancellationToken = default)
    {
        await InitializeRolesAsync(cancellationToken);
        await InitializeGeneralTestAsync(cancellationToken);
        await InitializeAdviceListsAsync(cancellationToken);
    }

    private async Task InitializeRolesAsync(CancellationToken cancellationToken)
    {
        if (!roleManager.Roles.Any())
        {
            await roleManager.CreateAsync(new Role(Roles.Administrator));
        }
    }

    private async Task InitializeGeneralTestAsync(CancellationToken cancellationToken)
    {
        if (!await testRepository.CheckGeneralTestExistence(cancellationToken))
        {
            await using var fileStream = File.OpenRead(_assetOptions.GeneralTestFilePath);

            var generalTest = await JsonSerializer.DeserializeAsync<GeneralTest>(
                fileStream, _jsonSerializerOptions, cancellationToken);

            if (generalTest == null)
            {
                logger.LogError("Failed to deserialize general test");
                throw new InvalidOperationException("Failed to deserialize general test.");
            }

            await testRepository.SaveGeneralTest(generalTest, cancellationToken);

            logger.LogInformation("General test has been saved during initialization");
        }
    }

    private async Task InitializeAdviceListsAsync(CancellationToken cancellationToken)
    {
        if (!await adviceListRepository.CheckAdviceListsExistence(cancellationToken))
        {
            await using var fileStream = File.OpenRead(_assetOptions.AdviceListsFilePath);

            var adviceLists = await JsonSerializer.DeserializeAsync<IEnumerable<AdviceList>>(
                fileStream, _jsonSerializerOptions, cancellationToken);

            if (adviceLists == null)
            {
                logger.LogError("Failed to deserialize advice lists");
                throw new InvalidOperationException("Failed to deserialize advice lists.");
            }

            await adviceListRepository.SaveAdviceListsAsync(adviceLists, cancellationToken);

            logger.LogInformation("Advice lists have been saved during initialization");
        }
    }
}