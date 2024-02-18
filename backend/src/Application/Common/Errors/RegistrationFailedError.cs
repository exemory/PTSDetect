using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class RegistrationFailedError : Error
{
    public int ErrorsCount { get; }
    public IReadOnlyDictionary<string, string> Errors { get; }

    private RegistrationFailedError(IDictionary<string, string> errors)
        : base($"Registration failed, resulting in {errors.Count} error{(errors.Count != 1 ? 's' : "")}")
    {
        ErrorsCount = errors.Count;
        Errors = errors.AsReadOnly();
    }

    public RegistrationFailedError(IEnumerable<KeyValuePair<string, string>> errors)
        : this(errors.ToDictionary().AsReadOnly())
    {
    }
}