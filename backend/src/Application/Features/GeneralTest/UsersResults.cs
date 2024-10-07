using Application.Common.Constants;
using Application.Common.Interfaces.Repositories;
using Application.Common.Models;
using Application.Extensions;
using FluentValidation;
using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Data;
using HotChocolate.Types;

namespace Application.Features.GeneralTest;

public record GeneralTestUsersResultsInput(IList<string>? UserIds, string LanguageCode);

public class GeneralTestUsersResultsInputValidator : AbstractValidator<GeneralTestUsersResultsInput>
{
    public GeneralTestUsersResultsInputValidator()
    {
        RuleFor(x => x.LanguageCode)
            .NotEmpty()
            .MustBeLanguageCode(LanguageCodes.Set);
    }
}

[ExtendObjectType(GraphQlTypes.Query)]
public class GeneralTestUsersResultsQuery
{
    [Authorize(Roles = [Roles.Administrator])]
    public async Task<GeneralTestUsersResultsPayload> GeneralTestUsersResults(
        [Service] IValidator<GeneralTestUsersResultsInput> inputValidator,
        [Service] IUserRepository userRepository,
        GeneralTestUsersResultsInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return new GeneralTestUsersResultsPayload(null,
                validationResult.UnionErrors<IGeneralTestUsersResultsErrorUnion>());
        }

        var testResultsWithAdvices =
            await userRepository.GetGeneralTestUsersResults(input.UserIds, input.LanguageCode, cancellationToken);

        return new GeneralTestUsersResultsPayload(testResultsWithAdvices, null);
    }
}

[UnionType("GeneralTestUsersResultsError")]
public interface IGeneralTestUsersResultsErrorUnion;

public record GeneralTestUsersResultsPayload(
    [property: UsePaging(IncludeTotalCount = true)]
    [property: UseProjection]
    [property: UseFiltering]
    [property: UseSorting]
    IQueryable<GeneralTestUserResults>? UsersResults,
    IEnumerable<IGeneralTestUsersResultsErrorUnion>? Errors);