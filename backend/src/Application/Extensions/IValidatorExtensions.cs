using Application.Common.Errors;
using Application.Primitives;
using FluentValidation;

namespace Application.Extensions;

public static class IValidatorExtensions
{
    public static Result ValidateToResult<T>(this IValidator<T> validator, T instance)
    {
        var validationResult = validator.Validate(instance);

        if (validationResult.IsValid)
        {
            return Result.Success();
        }

        var errors = validationResult
            .Errors
            .Select(x => new PropertyValidationError(
                x.ErrorCode,
                x.ErrorMessage,
                x.PropertyName,
                x.FormattedMessagePlaceholderValues
                    .Select(y =>
                        new KeyValuePair<string, string>(y.Key, y.Value?.ToString() ?? string.Empty))
                    .ToList()))
            .ToList();

        return new ValidationError(errors);
    }
}