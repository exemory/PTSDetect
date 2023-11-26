using Application.Common.Errors;
using Microsoft.AspNetCore.Identity;

namespace Application.Extensions;

public static class IdentityErrorExtensions
{
    public static RegistrationFailedError ToError(this IEnumerable<IdentityError> identityErrors)
    {
        return new RegistrationFailedError(identityErrors
            .Select(x => new RegistrationError(x.Code, x.Description))
            .ToList());
    }
}