using Error = Application.Primitives.Error.Error;

namespace Application.Common.Errors;

public record struct RegistrationError(string Code, string Message);

public class RegistrationFailedError(ICollection<RegistrationError> errors)
    : Error($"Registration failed, resulting in {errors.Count} errors")
{
    public string ErrorsCount { get; } = errors.Count.ToString(); //TODO: replace with int when HC14.0 released
    public ICollection<RegistrationError> Errors { get; } = errors;
}