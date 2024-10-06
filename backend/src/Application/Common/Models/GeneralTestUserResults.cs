namespace Application.Common.Models;

public record GeneralTestUserResults
{
    public required string UserId { get; init; }
    public required IList<GeneralTestResult> GeneralTestResults { get; init; }
}