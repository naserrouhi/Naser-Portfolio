namespace NaserPortfolio.Domain.Articles;

public interface IArticleRepository
{
    Task<IReadOnlyList<Article>> GetPublishedAsync(CancellationToken cancellationToken = default);

    Task<Article?> FindPublishedBySlugAsync(
        Slug slug,
        CancellationToken cancellationToken = default);
}
