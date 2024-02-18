using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class EmailIsNotVerifiedError()
    : Error("Email is not verified");