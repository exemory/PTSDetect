using System.Reflection;
using WebAPI.Infrastructure;

namespace WebAPI.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication MapEndpoints(this WebApplication app)
    {
        var endpointGroupType = typeof(EndpointGroupBase);
        var webApiAssembly = Assembly.GetExecutingAssembly();

        var endpointGroupTypes = webApiAssembly
            .GetExportedTypes()
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