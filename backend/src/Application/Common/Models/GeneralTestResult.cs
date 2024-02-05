namespace Application.Common.Models;

public record GeneralTestResult
{
    public required Guid Id { get; init; }
    public required DateTimeOffset CompletionDate { get; init; }
    public required IList<string> PotentialProblems { get; init; }
    public required IList<AdviceList> AdviceLists { get; init; }
}