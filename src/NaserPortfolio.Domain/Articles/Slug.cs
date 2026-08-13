using System.Text.RegularExpressions;

namespace NaserPortfolio.Domain.Articles;

public sealed partial record Slug
{
    public const int MaximumLength = 120;

    private Slug(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static Slug Create(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        var normalized = WhitespaceOrUnderscoreRegex()
            .Replace(value.Trim().ToLowerInvariant(), "-");
        normalized = RepeatedHyphenRegex().Replace(normalized, "-");

        if (normalized.Length > MaximumLength)
        {
            throw new ArgumentException($"A slug cannot exceed {MaximumLength} characters.", nameof(value));
        }

        if (!ValidSlugRegex().IsMatch(normalized))
        {
            throw new ArgumentException(
                "A slug must contain only lowercase ASCII letters, numbers, and single hyphens.",
                nameof(value));
        }

        return new Slug(normalized);
    }

    public override string ToString() => Value;

    [GeneratedRegex(@"[\s_]+", RegexOptions.CultureInvariant)]
    private static partial Regex WhitespaceOrUnderscoreRegex();

    [GeneratedRegex("-{2,}", RegexOptions.CultureInvariant)]
    private static partial Regex RepeatedHyphenRegex();

    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$", RegexOptions.CultureInvariant)]
    private static partial Regex ValidSlugRegex();
}
