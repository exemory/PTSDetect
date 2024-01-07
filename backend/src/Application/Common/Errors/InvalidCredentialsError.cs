using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class InvalidCredentialsError()
    : Error("Provided credentials are invalid");