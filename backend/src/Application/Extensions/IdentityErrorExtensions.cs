using Application.Common.Errors;
using Microsoft.AspNetCore.Identity;

namespace Application.Extensions;

public static class IdentityErrorExtensions
{
    public static RegistrationFailedError ToRegistrationFailedError(this IEnumerable<IdentityError> identityErrors)
    {
        return new RegistrationFailedError(identityErrors
            .Select(x => new RegistrationError(x.Code, x.Description))
            .ToList());
    }

    public static ResetPasswordFailedError ToResetPasswordError(this IEnumerable<IdentityError> identityErrors)
    {
        return new ResetPasswordFailedError(identityErrors
            .Select(x => new KeyValuePair<string, string>(x.Code, x.Description))
            .ToList());
    }
}