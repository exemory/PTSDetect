using Application.Infrastructure;

namespace WebAPI.Endpoints;

public class GraphQL : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGraphQL();
    }
}