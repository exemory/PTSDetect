using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public record struct RegistrationError(string Code, string Message);

public class RegistrationFailedError : Error
{
    public int ErrorsCount { get; }
    public IReadOnlyList<RegistrationError> Errors { get; }

    private RegistrationFailedError(IList<RegistrationError> errors)
        : base($"Registration failed, resulting in {errors.Count} error{(errors.Count != 1 ? 's' : "")}")
    {
        ErrorsCount = errors.Count;
        Errors = errors.AsReadOnly();
    }

    public RegistrationFailedError(IEnumerable<RegistrationError> errors)
        : this(errors.ToList())
    {
    }
}