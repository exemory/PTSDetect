using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Common.Models;
using Application.Extensions;
using Application.Features.GeneralTest.ResultsAnalysis.Interfaces;
using Application.Primitives;
using FluentValidation;
using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Types;
using GeneralTestResult = Application.Infrastructure.Identity.GeneralTestResult;

namespace Application.Features.GeneralTest;

public record SubmitGeneralTestAnswersInput(IList<AnsweredQuestion> Answers);

public class SubmitGeneralTestAnswersInputValidator : AbstractValidator<SubmitGeneralTestAnswersInput>
{
    public SubmitGeneralTestAnswersInputValidator()
    {
        RuleFor(x => x.Answers)
            .NotEmpty();
    }
}

[ExtendObjectType(GraphQlTypes.Mutation)]
public class SubmitGeneralTestAnswersMutation
{
    [Authorize]
    [Error<ValidationError>]
    [Error<AnswersCountMismatchError>]
    [Error<AnswerNotProvidedError>]
    [Error<AnswerMismatchError>]
    public async Task<MutationResult<SubmitGeneralTestAnswersPayload>> SubmitGeneralTestAnswers(
        [Service] ICurrentUser currentUser,
        [Service] ITestRepository testRepository,
        [Service] IUserRepository userRepository,
        [Service] IGeneralTestAnswersProcessor iGeneralTestAnswersProcessor,
        [Service] IValidator<SubmitGeneralTestAnswersInput> inputValidator,
        SubmitGeneralTestAnswersInput input,
        CancellationToken cancellationToken = default)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return validationResult.Errors
                .ToMutationResult<SubmitGeneralTestAnswersPayload>();
        }

        var test = await testRepository.GetGeneralTest(cancellationToken);
        var answers = input.Answers
            .ToDictionary(x => x.QuestionId, x => x.AnswerId);

        var answersValidationResult = ValidateAnswers(test, answers);
        if (answersValidationResult.IsFailure)
        {
            return answersValidationResult.Errors
                .ToMutationResult<SubmitGeneralTestAnswersPayload>();
        }

        var potentialProblems = iGeneralTestAnswersProcessor.Analyse(test, answers);

        var testResult = new GeneralTestResult
        {
            CompletionDate = DateTimeOffset.Now,
            PotentialProblems = potentialProblems,
            Answers = input.Answers
        };

        await userRepository.SaveGeneralTestResult(currentUser.Id, testResult, cancellationToken);

        return new SubmitGeneralTestAnswersPayload(testResult.Id);
    }

    private Result ValidateAnswers(Documents.GeneralTest test, IReadOnlyDictionary<Guid, Guid> answers)
    {
        var allQuestions = test.QuestionGroups
            .SelectMany(x =>
                x.Questions.Union(x.QuestionGroups.SelectMany(y => y.Questions)))
            .ToList();

        if (allQuestions.Count != answers.Count)
        {
            return new AnswersCountMismatchError(answers.Count, allQuestions.Count);
        }

        foreach (var question in allQuestions)
        {
            if (!answers.ContainsKey(question.Id))
            {
                return new AnswerNotProvidedError(question.Id);
            }

            if (question.Answers.All(x => x.Id != answers[question.Id]))
            {
                return new AnswerMismatchError(question.Id, answers[question.Id]);
            }
        }

        return Result.Success();
    }
}

public record SubmitGeneralTestAnswersPayload(Guid ResultId);