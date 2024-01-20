namespace Application.Common.Models;

public record Advice
{
    public required string Problem { get; init; }
    public required string Text { get; init; }
}