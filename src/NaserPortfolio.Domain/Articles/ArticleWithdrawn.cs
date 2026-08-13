using NaserPortfolio.Domain.Common;

namespace NaserPortfolio.Domain.Articles;

public sealed record ArticleWithdrawn(
    Guid ArticleId,
    string Slug,
    DateTimeOffset OccurredAtUtc) : IDomainEvent;
