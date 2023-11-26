using HotChocolate.Authorization;

namespace Application.Features.Auth;

//TODO: temporary
public class Query
{
    [Authorize]
    public string HelloWorld()
    {
        return "Hello, world!";
    }
}