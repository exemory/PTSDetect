using Application.Common.Errors;
using Microsoft.AspNetCore.Identity;

namespace Application.Extensions;

public static class IdentityErrorExtensions
{
    public static RegistrationFailedError ToRegistrationFailedError(this IEnumerable<IdentityError> identityErrors)
    {
        return new RegistrationFailedError(identityErrors
            .Select(x => new KeyValuePair<string, string>(x.Code, x.Description))
            .ToList());
    }

    public static EmailVerificationFailedError ToEmailVerificationFailedError(
        this IEnumerable<IdentityError> identityErrors)
    {
        return new EmailVerificationFailedError(identityErrors
            .Select(x => new KeyValuePair<string, string>(x.Code, x.Description))
            .ToList());
    }

    public static ResetPasswordFailedError ToResetPasswordFailedError(this IEnumerable<IdentityError> identityErrors)
    {
        return new ResetPasswordFailedError(identityErrors
            .Select(x => new KeyValuePair<string, string>(x.Code, x.Description))
            .ToList());
    }
}