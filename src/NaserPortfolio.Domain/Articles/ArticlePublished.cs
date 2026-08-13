using NaserPortfolio.Domain.Common;

namespace NaserPortfolio.Domain.Articles;

public sealed record ArticlePublished(
    Guid ArticleId,
    string Slug,
    DateTimeOffset OccurredAtUtc) : IDomainEvent;
