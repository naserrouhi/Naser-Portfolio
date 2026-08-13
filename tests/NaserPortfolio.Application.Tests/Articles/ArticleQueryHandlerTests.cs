using NaserPortfolio.Application.Articles;
using NaserPortfolio.Domain.Articles;

namespace NaserPortfolio.Application.Tests.Articles;

public sealed class ArticleQueryHandlerTests
{
    private static readonly DateTimeOffset CreatedAt = new(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);

    [Fact]
    public async Task List_handler_returns_the_requested_translation_and_newest_first()
    {
        var older = CreatePublishedArticle("older-article", CreatedAt.AddDays(1));
        var newer = CreatePublishedArticle("newer-article", CreatedAt.AddDays(2));
        var handler = new GetPublishedArticlesQueryHandler(new StubArticleRepository([older, newer]));

        var result = await handler.HandleAsync(
            new GetPublishedArticlesQuery("fa-IR"),
            CancellationToken.None);

        Assert.Collection(
            result,
            article =>
            {
                Assert.Equal("newer-article", article.Slug);
                Assert.Equal("fa", article.Language);
                Assert.Equal("عنوان فارسی", article.Title);
            },
            article => Assert.Equal("older-article", article.Slug));
    }

    [Fact]
    public async Task Detail_handler_falls_back_to_english_for_an_unavailable_language()
    {
        var article = CreatePublishedArticle("fallback-article", CreatedAt.AddDays(1));
        var handler = new GetArticleBySlugQueryHandler(new StubArticleRepository([article]));

        var result = await handler.HandleAsync(
            new GetArticleBySlugQuery("fallback-article", "ja"),
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("en", result.Language);
        Assert.Equal("A useful engineering article", result.Title);
        Assert.StartsWith("/articles/", result.CanonicalPath, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Detail_handler_falls_back_wholly_to_english_when_the_requested_translation_is_incomplete()
    {
        const string englishTitle = "A complete English engineering article";
        const string englishSummary = "A complete English summary for senior software engineers.";
        var englishBody = string.Join(' ', Enumerable.Repeat("architecture", 100));
        var article = Article.CreateDraft(
            Guid.NewGuid(),
            Slug.Create("incomplete-persian-translation"),
            LocalizedText.Create(("en", englishTitle), ("fa", "عنوان فارسی معتبر")),
            LocalizedText.Create(("en", englishSummary)),
            LocalizedText.Create(
                ("en", englishBody),
                ("fa", string.Join(' ', Enumerable.Repeat("معماری", 100)))),
            ["architecture"],
            CreatedAt);
        article.Publish(CreatedAt.AddDays(1));
        var handler = new GetArticleBySlugQueryHandler(new StubArticleRepository([article]));

        var result = await handler.HandleAsync(
            new GetArticleBySlugQuery("incomplete-persian-translation", "fa-IR"),
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("en", result.Language);
        Assert.Equal(englishTitle, result.Title);
        Assert.Equal(englishSummary, result.Summary);
        Assert.Equal(englishBody, result.Body);
        Assert.Equal(["en"], result.AvailableLanguages);
    }

    [Fact]
    public async Task Detail_handler_returns_null_when_the_published_article_does_not_exist()
    {
        var handler = new GetArticleBySlugQueryHandler(new StubArticleRepository([]));

        var result = await handler.HandleAsync(
            new GetArticleBySlugQuery("missing-article"),
            CancellationToken.None);

        Assert.Null(result);
    }

    private static Article CreatePublishedArticle(string slug, DateTimeOffset publishedAt)
    {
        var article = Article.CreateDraft(
            Guid.NewGuid(),
            Slug.Create(slug),
            LocalizedText.Create(("en", "A useful engineering article"), ("fa", "عنوان فارسی")),
            LocalizedText.Create(
                ("en", "A practical summary for senior software engineers."),
                ("fa", "خلاصه‌ای کاربردی برای مهندسان نرم‌افزار ارشد.")),
            LocalizedText.Create(
                ("en", string.Join(' ', Enumerable.Repeat("architecture", 100))),
                ("fa", string.Join(' ', Enumerable.Repeat("معماری", 100)))),
            ["architecture", ".net"],
            CreatedAt);
        article.Publish(publishedAt);
        article.ClearDomainEvents();
        return article;
    }

    private sealed class StubArticleRepository(IReadOnlyList<Article> articles) : IArticleRepository
    {
        public Task<IReadOnlyList<Article>> GetPublishedAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult(articles);

        public Task<Article?> FindPublishedBySlugAsync(
            Slug slug,
            CancellationToken cancellationToken = default) =>
            Task.FromResult(articles.SingleOrDefault(article => article.Slug == slug));
    }
}
