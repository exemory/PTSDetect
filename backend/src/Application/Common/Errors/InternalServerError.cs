using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class InternalServerError() 
    : Error("An internal server error has occurred. Please try again later.");