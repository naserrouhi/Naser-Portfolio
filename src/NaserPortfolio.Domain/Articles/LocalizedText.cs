using System.Collections.ObjectModel;
using System.Globalization;

namespace NaserPortfolio.Domain.Articles;

public sealed class LocalizedText : IEquatable<LocalizedText>
{
    public const string DefaultLanguage = "en";
    public const int MaximumTranslationLength = 50_000;

    private readonly IReadOnlyDictionary<string, string> _translations;

    private LocalizedText(IReadOnlyDictionary<string, string> translations)
    {
        _translations = translations;
    }

    public IReadOnlyCollection<string> Languages => _translations.Keys.ToArray();

    public static LocalizedText Create(IEnumerable<KeyValuePair<string, string>> translations)
    {
        ArgumentNullException.ThrowIfNull(translations);

        var normalized = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        foreach (var (language, text) in translations)
        {
            var normalizedLanguage = NormalizeLanguage(language);
            ArgumentException.ThrowIfNullOrWhiteSpace(text);
            var normalizedText = text.Trim();

            if (normalizedText.Length > MaximumTranslationLength)
            {
                throw new ArgumentException(
                    $"A translation cannot exceed {MaximumTranslationLength} characters.",
                    nameof(translations));
            }

            if (!normalized.TryAdd(normalizedLanguage, normalizedText))
            {
                throw new ArgumentException(
                    $"The language '{normalizedLanguage}' appears more than once.",
                    nameof(translations));
            }
        }

        if (normalized.Count == 0)
        {
            throw new ArgumentException("At least one translation is required.", nameof(translations));
        }

        return new LocalizedText(new ReadOnlyDictionary<string, string>(normalized));
    }

    public static LocalizedText Create(params (string Language, string Text)[] translations) =>
        Create(translations.Select(static translation =>
            new KeyValuePair<string, string>(translation.Language, translation.Text)));

    public bool Contains(string language) =>
        TryNormalizeLanguage(language, out var normalizedLanguage) &&
        _translations.ContainsKey(normalizedLanguage);

    public ResolvedText Resolve(string? requestedLanguage)
    {
        if (TryNormalizeLanguage(requestedLanguage, out var normalizedLanguage))
        {
            if (_translations.TryGetValue(normalizedLanguage, out var exactTranslation))
            {
                return new ResolvedText(normalizedLanguage, exactTranslation);
            }

            var neutralLanguage = normalizedLanguage.Split('-', 2)[0];
            if (_translations.TryGetValue(neutralLanguage, out var neutralTranslation))
            {
                return new ResolvedText(neutralLanguage, neutralTranslation);
            }
        }

        if (_translations.TryGetValue(DefaultLanguage, out var defaultTranslation))
        {
            return new ResolvedText(DefaultLanguage, defaultTranslation);
        }

        var firstTranslation = _translations.First();
        return new ResolvedText(firstTranslation.Key, firstTranslation.Value);
    }

    public bool Equals(LocalizedText? other) =>
        other is not null &&
        _translations.Count == other._translations.Count &&
        _translations.All(pair =>
            other._translations.TryGetValue(pair.Key, out var value) &&
            string.Equals(pair.Value, value, StringComparison.Ordinal));

    public override bool Equals(object? obj) => Equals(obj as LocalizedText);

    public override int GetHashCode()
    {
        var hash = new HashCode();
        foreach (var pair in _translations.OrderBy(static pair => pair.Key, StringComparer.OrdinalIgnoreCase))
        {
            hash.Add(pair.Key, StringComparer.OrdinalIgnoreCase);
            hash.Add(pair.Value, StringComparer.Ordinal);
        }

        return hash.ToHashCode();
    }

    private static string NormalizeLanguage(string language)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(language);

        try
        {
            return CultureInfo.GetCultureInfo(language.Trim()).Name;
        }
        catch (CultureNotFoundException exception)
        {
            throw new ArgumentException($"'{language}' is not a valid language tag.", nameof(language), exception);
        }
    }

    public static bool TryNormalizeLanguage(string? language, out string normalizedLanguage)
    {
        normalizedLanguage = string.Empty;
        if (string.IsNullOrWhiteSpace(language))
        {
            return false;
        }

        try
        {
            normalizedLanguage = NormalizeLanguage(language);
            return true;
        }
        catch (ArgumentException)
        {
            return false;
        }
    }
}

public sealed record ResolvedText(string Language, string Value);
