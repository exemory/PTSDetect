using Error = Application.Primitives.Error.Error;

namespace Application.Common.Errors;

public class UserNotFoundError(string userId) : Error($"User with id '{userId}' is not found")
{
}