using NaserPortfolio.Domain.Articles;

namespace NaserPortfolio.Application.Articles;

public sealed record GetArticleBySlugQuery(
    string Slug,
    string? Language = LocalizedText.DefaultLanguage);

public sealed class GetArticleBySlugQueryHandler(IArticleRepository articleRepository)
{
    public async Task<ArticleDetailsDto?> HandleAsync(
        GetArticleBySlugQuery query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        var slug = Slug.Create(query.Slug);
        var article = await articleRepository.FindPublishedBySlugAsync(slug, cancellationToken);

        return article is null ? null : ArticleDtoMapper.ToDetails(article, query.Language);
    }
}
