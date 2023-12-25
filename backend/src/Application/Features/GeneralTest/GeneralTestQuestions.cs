using Application.Common.Constants;
using Application.Common.Interfaces.Repositories;
using Application.Common.Models;
using Application.Extensions;
using FluentValidation;

namespace Application.Features.GeneralTest;

public record GeneralTestQuestionsInput(string LanguageCode);

public class GeneralTestQuestionsInputValidator : AbstractValidator<GeneralTestQuestionsInput>
{
    public GeneralTestQuestionsInputValidator()
    {
        RuleFor(x => x.LanguageCode)
            .NotEmpty()
            .Must(x => LanguageCodes.Set.Contains(x))
            .WithMessage(x =>
            {
                var availableLanguageCodes = string.Join(", ", LanguageCodes.Set);
                return $"{{PropertyName}} must contain language code. Available codes: {availableLanguageCodes}";
            });
    }
}

[ExtendObjectType(GraphQlTypes.Query)]
public class GeneralTestQuestionsQuery
{
    public async Task<GeneralTestQuestionsPayload> GeneralTestQuestions(
        [Service] IValidator<GeneralTestQuestionsInput> inputValidator,
        [Service] ITestRepository testRepository,
        GeneralTestQuestionsInput input,
        CancellationToken cancellationToken)
    {
        var validationResult = inputValidator.ValidateToResult(input);

        if (validationResult.IsFailure)
        {
            return new GeneralTestQuestionsPayload(null, validationResult.Errors.Select(x => x.Message));
        }

        var questions = await testRepository
            .GetGeneralTestQuestions(input.LanguageCode, cancellationToken);

        return new GeneralTestQuestionsPayload(questions, null);
    }
}

public record GeneralTestQuestionsPayload(IQueryable<Question>? Questions, IEnumerable<string>? Errors);