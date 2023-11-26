namespace Application.Primitives.Error;

public abstract class Error(string message)
{
    public string Message { get; set; } = message;
}