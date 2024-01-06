﻿using Application.Common.Constants;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Common.Models;
using Application.Extensions;
using FluentValidation;
using HotChocolate.Authorization;

namespace Application.Features.GeneralTest;

public record GeneralTestResultInput(Guid ResultId, string LanguageCode);

public class GeneralTestResultInputValidator : AbstractValidator<GeneralTestResultInput>
{
    public GeneralTestResultInputValidator()
    {
        RuleFor(x => x.ResultId)
            .NotEmpty();

        RuleFor(x => x.LanguageCode)
            .NotEmpty()
            .MustBeLanguageCode(LanguageCodes.Set);
    }
}

[ExtendObjectType(GraphQlTypes.Query)]
public class GeneralTestResultQuery
{
    [Authorize]
    public async Task<GeneralTestResultPayload> GeneralTestResult(
        [Service] IValidator<GeneralTestResultInput> inputValidator,
        [Service] IUserRepository userRepository,
        [Service] ICurrentUser currentUser,
        GeneralTestResultInput input,
        CancellationToken cancellationToken)
    {
        var validationResult = inputValidator.ValidateToResult(input);
        if (validationResult.IsFailure)
        {
            return new GeneralTestResultPayload(null!, validationResult.Errors.Select(x => x.Message));
        }

        var testResultWithAdvice =
            await userRepository.GetGeneralTestResult(input.ResultId, currentUser.Id, input.LanguageCode,
                cancellationToken);

        if (testResultWithAdvice is null)
        {
            return new GeneralTestResultPayload(null, [$"Test result with id {input.ResultId} is not found"]);
        }

        return new GeneralTestResultPayload(testResultWithAdvice, null);
    }
}

public record GeneralTestResultPayload(
    GeneralTestResult? Result,
    IEnumerable<string>? Errors);