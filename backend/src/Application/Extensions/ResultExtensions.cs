using Application.Primitives;
using HotChocolate;
using Void = Application.ScalarTypes.Void;

namespace Application.Extensions;

public static class ResultExtensions
{
    public static MutationResult<Void> ToMutationResult(this Result result) =>
        result.IsSuccess ? new MutationResult<Void>(new Void()) : new MutationResult<Void>(result.Errors);

    public static MutationResult<T> ToMutationResult<T>(this Result<T> result) =>
        result.IsSuccess ? new MutationResult<T>(result.Value) : new MutationResult<T>(result.Errors);

    public static IEnumerable<TUnion> UnionErrors<TUnion>(this Result result) =>
        result.Errors
            .Where(x => x is TUnion)
            .Cast<TUnion>();
}