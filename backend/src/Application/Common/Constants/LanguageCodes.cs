using System.Collections.Frozen;

namespace Application.Common.Constants;

public static class LanguageCodes
{
    public const string English = "en";
    public const string Ukrainian = "uk";
    public const string Russian = "ru";

    public static readonly ISet<string> Set =
        new[] {English, Ukrainian, Russian}.ToFrozenSet();
}