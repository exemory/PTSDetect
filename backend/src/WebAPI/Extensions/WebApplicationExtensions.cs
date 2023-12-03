using System.Reflection;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using WebAPI.Infrastructure;

namespace WebAPI.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication MapHealthChecks(this WebApplication app)
    {
        app.MapHealthChecks("/healthz", new HealthCheckOptions
        {
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });

        return app;
    }

    public static WebApplication MapEndpoints(this WebApplication app)
    {
        var endpointGroupType = typeof(EndpointGroupBase);

        var webApiAssembly = Assembly.GetExecutingAssembly();
        var applicationAssembly = Assembly.GetAssembly(typeof(DependencyInjection));

        var endpointGroupTypes =
            new[] {webApiAssembly, applicationAssembly}
                .SelectMany(x => x?.GetExportedTypes() ?? Type.EmptyTypes)
                .Where(t => t.IsSubclassOf(endpointGroupType));

        foreach (var type in endpointGroupTypes)
        {
            if (Activator.CreateInstance(type) is EndpointGroupBase instance)
            {
                instance.Map(app);
            }
        }

        return app;
    }
}