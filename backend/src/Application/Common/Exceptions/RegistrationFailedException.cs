using Application.Common.Primitives;
using Microsoft.AspNetCore.Identity;

namespace Application.Common.Exceptions;

public class RegistrationFailedException : Exception
{
    public IEnumerable<ErrorDescription> Errors { get; set; }

    public RegistrationFailedException(IEnumerable<IdentityError> errors)
        : base("Registration failed")
    {
        Errors = errors.Select(x => new ErrorDescription(x.Code, x.Description))
            .ToList();
    }
}