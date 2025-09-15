using Application.Options;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using WebAPI.Options;
using WebAPI.Telemetry;

namespace WebAPI;

public static class DependencyInjection
{
    public static IServiceCollection AddWebApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddApplicationMonitoring(configuration);
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

    private static IServiceCollection AddApplicationMonitoring(this IServiceCollection services,
        IConfiguration configuration)
    {
        var productInfo = configuration
            .GetSection(ProductInfo.SectionName)
            .Get<ProductInfo>() ?? new ProductInfo();

        services.AddSerilog(config =>
        {
            config.ReadFrom.Configuration(configuration);
            config.WriteTo.Console();
            config.WriteTo.OpenTelemetry(options =>
            {
                options.ResourceAttributes = new Dictionary<string, object>
                {
                    { Attributes.ServiceName, productInfo.Name },
                    { Attributes.ServiceVersion, productInfo.Version },
                    { Attributes.ServiceInstanceId, Program.InstanceId }
                };
            });
        });

        services.AddOpenTelemetry()
            .ConfigureResource(resource =>
            {
                resource.AddService(
                    productInfo.Name,
                    serviceVersion: productInfo.Version,
                    serviceInstanceId: Program.InstanceId.ToString()
                );
            })
            .WithTracing(tracing =>
            {
                tracing.AddSource(productInfo.Name)
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddHotChocolateInstrumentation()
                    .AddOtlpExporter();
            })
            .WithMetrics(metrics =>
            {
                metrics.AddMeter(productInfo.Name)
                    .AddRuntimeInstrumentation()
                    .AddProcessInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddOtlpExporter();
            });

        return services;
    }
}