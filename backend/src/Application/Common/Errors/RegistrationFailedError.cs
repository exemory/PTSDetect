using Error = Application.Primitives.Error.Error;

namespace Application.Common.Errors;

public record struct RegistrationError(string Code, string Message);

public class RegistrationFailedError : Error
{
    public int ErrorsCount { get; }
    public IList<RegistrationError> Errors { get; }

    private RegistrationFailedError(IList<RegistrationError> errors)
        : base($"Registration failed, resulting in {errors.Count} errors")
    {
        ErrorsCount = errors.Count;
        Errors = errors;
    }

    public RegistrationFailedError(IEnumerable<RegistrationError> errors)
        : this(errors.ToList())
    {
    }
}