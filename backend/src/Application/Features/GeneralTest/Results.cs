using Application.Common.Constants;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Common.Models;
using Application.Extensions;
using FluentValidation;
using HotChocolate.Authorization;

namespace Application.Features.GeneralTest;

public record GeneralTestResultsInput(string LanguageCode);

public class GeneralTestResultsInputValidator : AbstractValidator<GeneralTestResultsInput>
{
    public GeneralTestResultsInputValidator()
    {
        RuleFor(x => x.LanguageCode)
            .NotEmpty()
            .MustBeLanguageCode(LanguageCodes.Set);
    }
}

[ExtendObjectType(GraphQlTypes.Query)]
public class GeneralTestResultsQuery
{
    [Authorize]
    public async Task<GeneralTestResultsPayload> GeneralTestResults(
        [Service] IValidator<GeneralTestQuestionsInput> inputValidator,
        [Service] IUserRepository userRepository,
        [Service] ICurrentUser currentUser,
        GeneralTestQuestionsInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return new GeneralTestResultsPayload(null, validationResult.UnionErrors<IGeneralTestResultsErrorUnion>());
        }

        var testResultsWithAdvices =
            await userRepository.GetGeneralTestResults(currentUser.Id, input.LanguageCode, cancellationToken);

        return new GeneralTestResultsPayload(testResultsWithAdvices, null);
    }
}

[UnionType("GeneralTestResultsError")]
public interface IGeneralTestResultsErrorUnion;

public record GeneralTestResultsPayload(
    [property: UsePaging]
    [property: UseProjection]
    [property: UseFiltering]
    [property: UseSorting]
    IQueryable<GeneralTestResult>? Results,
    IEnumerable<IGeneralTestResultsErrorUnion>? Errors);