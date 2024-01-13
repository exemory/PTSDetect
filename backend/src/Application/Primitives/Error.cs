namespace Application.Primitives;

public abstract class Error(string message)
{
    public string Message { get; set; } = message;
}