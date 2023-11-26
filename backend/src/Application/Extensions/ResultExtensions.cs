using Result = Application.Primitives.Result;
using Void = Application.ScalarTypes.Void;

namespace Application.Extensions;

public static class ResultExtensions
{
    public static MutationResult<Void> ToMutationResult(this Result.Result result) =>
        result.IsSuccess ? new MutationResult<Void>(new Void()) : new MutationResult<Void>(result.Errors);

    public static MutationResult<T> ToMutationResult<T>(this Result.Result<T> result) =>
        result.IsSuccess ? new MutationResult<T>(result.Value) : new MutationResult<T>(result.Errors);
}