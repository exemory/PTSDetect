using System.Collections.ObjectModel;

namespace Application.Primitives.Result;

using Error = Application.Primitives.Error.Error;

public enum ResultKind
{
    Success,
    Failure
}

public class Result
{
    public ResultKind ResultKind { get; }
    public bool IsSuccess => ResultKind == ResultKind.Success;
    public bool IsFailure => ResultKind == ResultKind.Failure;
    public ReadOnlyCollection<Error> Errors { get; }

    public Result()
    {
        ResultKind = ResultKind.Success;
        Errors = Array.Empty<Error>().AsReadOnly();
    }

    public Result(IEnumerable<Error> errors)
    {
        ResultKind = ResultKind.Failure;
        Errors = errors.ToList().AsReadOnly();
    }

    public Result(Error error)
    {
        ResultKind = ResultKind.Failure;
        Errors = new[] {error}.AsReadOnly();
    }

    public Result(params Error[] errors)
        : this((IEnumerable<Error>) errors)
    {
    }

    public static Result Success() => new();
    public static Result Failure(Error error) => new(error);
    public static Result Failure(IEnumerable<Error> errors) => new(errors);
    public static Result<T> Success<T>(T value) => new(value);
    public static Result<T> Failure<T>(Error error) => new(error);
    public static Result<T> Failure<T>(IEnumerable<Error> errors) => new(errors);

    public static implicit operator Result(Error error) => new(error);
    public static implicit operator Result(Error[] errors) => new(errors);
    public static implicit operator Result(List<Error> errors) => new(errors);
    public static implicit operator Result(ReadOnlyCollection<Error> errors) => new(errors);
}