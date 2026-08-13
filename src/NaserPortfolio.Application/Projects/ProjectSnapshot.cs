namespace NaserPortfolio.Application.Projects;

public sealed record ProjectSnapshot(
    string Slug,
    string Name,
    string Summary,
    string RepositoryUrl,
    string? LiveUrl,
    string PrimaryLanguage,
    IReadOnlyList<string> Technologies,
    int? Stars,
    DateTimeOffset? LastPushedAtUtc,
    bool IsFeatured,
    string Evidence);
