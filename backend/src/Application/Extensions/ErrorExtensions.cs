using Error = Application.Primitives.Error.Error;
using Void = Application.ScalarTypes.Void;

namespace Application.Extensions;

public static class ErrorExtensions
{
    public static MutationResult<Void> ToMutationResult(this Error error)
    {
        return new MutationResult<Void>(error);
    }

    public static MutationResult<Void> ToMutationResult(this IEnumerable<Error> errors)
    {
        return new MutationResult<Void>(errors);
    }

    public static MutationResult<T> ToMutationResult<T>(this Error error)
    {
        return new MutationResult<T>(error);
    }

    public static MutationResult<T> ToMutationResult<T>(this IEnumerable<Error> errors)
    {
        return new MutationResult<T>(errors);
    }
}