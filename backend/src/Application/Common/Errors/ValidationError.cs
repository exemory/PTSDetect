﻿using Application.Features.GeneralTest;
using Application.Features.Registration;
using Application.Features.ResetPassword;
using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public record struct PropertyValidationError(
    string ErrorCode,
    string ErrorMessage,
    string PropertyName,
    ICollection<KeyValuePair<string, string>> Placeholders);

public class ValidationError : Error,
    IGeneralTestResultsErrorUnion,
    IGeneralTestUsersResultsErrorUnion,
    IGeneralTestResultErrorUnion,
    IGeneralTestQuestionsErrorUnion,
    IIsEmailTakenErrorUnion,
    IResetPasswordTokenVerificationErrorUnion
{
    public int ErrorsCount { get; }
    public IList<PropertyValidationError> Errors { get; }

    private ValidationError(IList<PropertyValidationError> errors)
        : base($"Validation failed, resulting in {errors.Count} error{(errors.Count != 1 ? 's' : "")}")
    {
        ErrorsCount = errors.Count;
        Errors = errors;
    }

    public ValidationError(IEnumerable<PropertyValidationError> errors)
        : this(errors.ToList())
    {
    }
}