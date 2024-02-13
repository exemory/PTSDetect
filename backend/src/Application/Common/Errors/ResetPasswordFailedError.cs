using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class ResetPasswordFailedError : Error
{
    public int ErrorsCount { get; }
    public IReadOnlyDictionary<string, string> Errors { get; }

    private ResetPasswordFailedError(IDictionary<string, string> errors)
        : base($"Attempt to reset the password failed, " +
               $"resulting in {errors.Count} error{(errors.Count != 1 ? 's' : "")}")
    {
        ErrorsCount = errors.Count;
        Errors = errors.AsReadOnly();
    }

    public ResetPasswordFailedError(IEnumerable<KeyValuePair<string, string>> errors)
        : this(errors.ToDictionary().AsReadOnly())
    {
    }
}