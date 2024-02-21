using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class EmailVerificationFailedError : Error
{
    public int ErrorsCount { get; }
    public IReadOnlyDictionary<string, string> Errors { get; }

    private EmailVerificationFailedError(IDictionary<string, string> errors)
        : base($"Email verification failed, " +
               $"resulting in {errors.Count} error{(errors.Count != 1 ? 's' : "")}")
    {
        ErrorsCount = errors.Count;
        Errors = errors.AsReadOnly();
    }

    public EmailVerificationFailedError(IEnumerable<KeyValuePair<string, string>> errors)
        : this(errors.ToDictionary().AsReadOnly())
    {
    }
}