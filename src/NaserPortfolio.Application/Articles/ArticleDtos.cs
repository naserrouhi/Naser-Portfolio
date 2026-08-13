namespace NaserPortfolio.Application.Articles;

public sealed record ArticleSummaryDto(
    string Slug,
    string Title,
    string Summary,
    string Language,
    IReadOnlyList<string> AvailableLanguages,
    IReadOnlyList<string> Tags,
    DateTimeOffset PublishedAtUtc,
    int ReadingTimeMinutes,
    string CanonicalPath);

public sealed record ArticleDetailsDto(
    string Slug,
    string Title,
    string Summary,
    string Body,
    string Language,
    IReadOnlyList<string> AvailableLanguages,
    IReadOnlyList<string> Tags,
    DateTimeOffset PublishedAtUtc,
    int ReadingTimeMinutes,
    string CanonicalPath);
