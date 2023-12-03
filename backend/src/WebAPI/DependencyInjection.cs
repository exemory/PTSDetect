using Application.Options;

namespace WebAPI;

public static class DependencyInjection
{
    public static IServiceCollection AddWebApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHealthChecks(configuration);

        return services;
    }

    private static IServiceCollection AddHealthChecks(this IServiceCollection services, IConfiguration configuration)
    {
        var mongoDbOptions = configuration
            .GetRequiredSection(MongoDbOptions.SectionName)
            .Get<MongoDbOptions>();

        if (mongoDbOptions is null)
        {
            throw new InvalidOperationException("Failed to obtain the MongoDB options from the configuration.");
        }
        
        services.AddHealthChecks()
            .AddMongoDb(mongoDbOptions.ConnectionString);
        
        return services;
    }
}