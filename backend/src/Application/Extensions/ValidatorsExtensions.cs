using FluentValidation;

namespace Application.Extensions;

public static class ValidatorsExtensions
{
    public static IRuleBuilderOptions<T, string> MustBeLanguageCode<T>(this IRuleBuilder<T, string> ruleBuilder,
        ISet<string> allowedLanguageCodes)
    {
        return ruleBuilder
            .Must(allowedLanguageCodes.Contains)
            .WithMessage(x =>
            {
                var availableLanguageCodes = string.Join(", ", allowedLanguageCodes);
                return $"{{PropertyName}} must contain language code. Available codes: {availableLanguageCodes}";
            });
    }
}