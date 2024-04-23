using Application.Common.Constants;
using Application.Common.Interfaces.Repositories;
using Application.Common.Models;
using Application.Extensions;
using FluentValidation;
using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Types;

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
    [Authorize]
    public async Task<GeneralTestQuestionsPayload> GeneralTestQuestions(
        [Service] IValidator<GeneralTestQuestionsInput> inputValidator,
        [Service] ITestRepository testRepository,
        GeneralTestQuestionsInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);

        if (validationResult.IsFailure)
        {
            return new GeneralTestQuestionsPayload(null,
                validationResult.UnionErrors<IGeneralTestQuestionsErrorUnion>());
        }

        var questions = await testRepository
            .GetGeneralTestQuestions(input.LanguageCode, cancellationToken);

        return new GeneralTestQuestionsPayload(questions, null);
    }
}

[UnionType("GeneralTestQuestionsErrorUnion")]
public interface IGeneralTestQuestionsErrorUnion;

public record GeneralTestQuestionsPayload(
    [property: UsePaging(IncludeTotalCount = true)] IQueryable<Question>? Questions,
    IEnumerable<IGeneralTestQuestionsErrorUnion>? Errors);