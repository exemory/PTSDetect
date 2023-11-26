using System.Collections.ObjectModel;

namespace Application.Primitives.Result;

using Error = Application.Primitives.Error.Error;

public sealed class Result<T> : Result
{
    private readonly T? _value;

    public T Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("Value property of a failed result can not be accessed.");

    public Result(T value)
    {
        _value = value;
    }

    public Result(IEnumerable<Error> errors)
        : base(errors)
    {
    }

    public Result(Error error)
        : base(error)
    {
    }

    public Result(params Error[] errors)
        : base(errors)
    {
    }

    public static implicit operator Result<T>(T value) => new(value);
    public static implicit operator Result<T>(Error error) => new(error);
    public static implicit operator Result<T>(Error[] errors) => new(errors);
    public static implicit operator Result<T>(List<Error> errors) => new(errors);
    public static implicit operator Result<T>(ReadOnlyCollection<Error> errors) => new(errors);
}