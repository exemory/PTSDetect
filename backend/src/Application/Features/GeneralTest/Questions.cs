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
            .MustBeLanguageCode(LanguageCodes.Set);
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
            return new GeneralTestQuestionsPayload(null!, validationResult.Errors.Select(x => x.Message));
        }

        var questions = await testRepository
            .GetGeneralTestQuestions(input.LanguageCode, cancellationToken);

        return new GeneralTestQuestionsPayload(questions, null);
    }
}

public record GeneralTestQuestionsPayload(
    [property: UsePaging] IQueryable<Question>? Questions,
    IEnumerable<string>? Errors);