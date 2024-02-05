namespace Application.Common.Models;

public record AdviceList
{
    public required string Problem { get; init; }
    public required string[] Advices { get; init; }
}