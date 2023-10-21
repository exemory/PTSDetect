using System.Reflection;
using Application.Infrastructure;

namespace WebAPI.Infrastructure;

public static class WebApplicationExtensions
{
    public static WebApplication MapEndpoints(this WebApplication app)
    {
        var endpointGroupType = typeof(EndpointGroupBase);

        var webApiAssembly = Assembly.GetExecutingAssembly();
        var applicationAssembly = Assembly.GetAssembly(typeof(Application.DependencyInjection));

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