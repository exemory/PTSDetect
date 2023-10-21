using Microsoft.AspNetCore.Builder;

namespace Application.Infrastructure;

public abstract class EndpointGroupBase
{
    public abstract void Map(WebApplication app);
}