using Error = Application.Primitives.Error.Error;

namespace Application.Common.Errors;

public class InvalidRefreshTokenError() : Error("Refresh token is not valid")
{
}