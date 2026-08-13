using NaserPortfolio.Domain.Articles;

namespace NaserPortfolio.Application.Articles;

internal static class ArticleDtoMapper
{
    public static ArticleSummaryDto ToSummary(Article article, string? requestedLanguage)
    {
        var availableLanguages = GetCompleteLanguages(article);
        var language = ResolveLanguage(availableLanguages, requestedLanguage);
        var title = article.Title.Resolve(language);
        var summary = article.Summary.Resolve(language);
        var body = article.Body.Resolve(language);

        return new ArticleSummaryDto(
            article.Slug.Value,
            title.Value,
            summary.Value,
            language,
            availableLanguages,
            article.Tags,
            article.PublishedAtUtc!.Value,
            CalculateReadingTime(body.Value),
            $"/articles/{article.Slug.Value}");
    }

    public static ArticleDetailsDto ToDetails(Article article, string? requestedLanguage)
    {
        var availableLanguages = GetCompleteLanguages(article);
        var language = ResolveLanguage(availableLanguages, requestedLanguage);
        var title = article.Title.Resolve(language);
        var summary = article.Summary.Resolve(language);
        var body = article.Body.Resolve(language);

        return new ArticleDetailsDto(
            article.Slug.Value,
            title.Value,
            summary.Value,
            body.Value,
            language,
            availableLanguages,
            article.Tags,
            article.PublishedAtUtc!.Value,
            CalculateReadingTime(body.Value),
            $"/articles/{article.Slug.Value}");
    }

    private static IReadOnlyList<string> GetCompleteLanguages(Article article) =>
        article.Title.Languages
            .Intersect(article.Summary.Languages, StringComparer.OrdinalIgnoreCase)
            .Intersect(article.Body.Languages, StringComparer.OrdinalIgnoreCase)
            .Order(StringComparer.OrdinalIgnoreCase)
            .ToArray();

    private static string ResolveLanguage(
        IReadOnlyList<string> availableLanguages,
        string? requestedLanguage)
    {
        if (LocalizedText.TryNormalizeLanguage(requestedLanguage, out var normalizedLanguage))
        {
            var exactLanguage = availableLanguages.FirstOrDefault(language =>
                string.Equals(language, normalizedLanguage, StringComparison.OrdinalIgnoreCase));
            if (exactLanguage is not null)
            {
                return exactLanguage;
            }

            var neutralLanguage = normalizedLanguage.Split('-', 2)[0];
            var neutralMatch = availableLanguages.FirstOrDefault(language =>
                string.Equals(language, neutralLanguage, StringComparison.OrdinalIgnoreCase));
            if (neutralMatch is not null)
            {
                return neutralMatch;
            }
        }

        return availableLanguages.FirstOrDefault(language =>
                   string.Equals(language, LocalizedText.DefaultLanguage, StringComparison.OrdinalIgnoreCase))
               ?? throw new InvalidOperationException(
                   "A published article must have a complete English translation.");
    }

    private static int CalculateReadingTime(string body)
    {
        var wordCount = body.Split(
            [' ', '\r', '\n', '\t'],
            StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Length;

        return Math.Max(1, (int)Math.Ceiling(wordCount / 220d));
    }
}
