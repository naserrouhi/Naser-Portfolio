using NaserPortfolio.Domain.Articles;

namespace NaserPortfolio.Application.Articles;

public sealed record GetPublishedArticlesQuery(string? Language = LocalizedText.DefaultLanguage);

public sealed class GetPublishedArticlesQueryHandler(IArticleRepository articleRepository)
{
    public async Task<IReadOnlyList<ArticleSummaryDto>> HandleAsync(
        GetPublishedArticlesQuery query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        var articles = await articleRepository.GetPublishedAsync(cancellationToken);

        return articles
            .Where(static article => article.Status == ArticleStatus.Published)
            .OrderByDescending(static article => article.PublishedAtUtc)
            .Select(article => ArticleDtoMapper.ToSummary(article, query.Language))
            .ToArray();
    }
}
