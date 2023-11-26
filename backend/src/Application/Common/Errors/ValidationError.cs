using Error = Application.Primitives.Error.Error;

namespace Application.Common.Errors;

public record struct PropertyValidationError(
    string ErrorCode,
    string ErrorMessage,
    string PropertyName,
    ICollection<KeyValuePair<string, string>> Placeholders);

public class ValidationError(ICollection<PropertyValidationError> errors)
    : Error($"Validation failed, resulting in {errors.Count} errors")
{
    public string ErrorsCount { get; } = errors.Count.ToString(); //TODO: replace with int when HC14.0 released
    public ICollection<PropertyValidationError> Errors { get; } = errors;
}