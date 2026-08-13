using NaserPortfolio.Domain.Articles;
using NaserPortfolio.Domain.Common;

namespace NaserPortfolio.Domain.Tests.Articles;

public sealed class ArticleTests
{
    private static readonly DateTimeOffset CreatedAt = new(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);

    [Fact]
    public void Publish_Transitions_the_draft_and_records_the_business_fact()
    {
        var article = CreatePublishableDraft();
        var publishedAt = CreatedAt.AddDays(1);

        article.Publish(publishedAt);

        Assert.Equal(ArticleStatus.Published, article.Status);
        Assert.Equal(publishedAt, article.PublishedAtUtc);
        var published = Assert.IsType<ArticlePublished>(Assert.Single(article.DomainEvents));
        Assert.Equal(article.Id, published.ArticleId);
        Assert.Equal(article.Slug.Value, published.Slug);
        Assert.Equal(publishedAt, published.OccurredAtUtc);
    }

    [Fact]
    public void Publish_Rejects_an_article_without_complete_english_content()
    {
        var article = Article.CreateDraft(
            Guid.NewGuid(),
            Slug.Create("persian-only-article"),
            LocalizedText.Create(("fa", "عنوان فارسی")),
            LocalizedText.Create(("fa", "این خلاصه فارسی برای آزمایش قانون انتشار مقاله است.")),
            LocalizedText.Create(("fa", new string('ب', Article.MinimumBodyLength))),
            ["ddd"],
            CreatedAt);

        var exception = Assert.Throws<DomainException>(() => article.Publish(CreatedAt.AddHours(1)));

        Assert.Contains("English translation", exception.Message, StringComparison.Ordinal);
        Assert.Equal(ArticleStatus.Draft, article.Status);
        Assert.Empty(article.DomainEvents);
    }

    [Theory]
    [InlineData("title", Article.MinimumTitleLength - 1)]
    [InlineData("title", Article.MaximumTitleLength + 1)]
    [InlineData("summary", Article.MinimumSummaryLength - 1)]
    [InlineData("summary", Article.MaximumSummaryLength + 1)]
    [InlineData("body", Article.MinimumBodyLength - 1)]
    public void Publish_Rejects_an_out_of_range_non_english_translation(
        string fieldName,
        int translationLength)
    {
        var article = CreateDraftWithGermanFieldLength(fieldName, translationLength);

        var exception = Assert.Throws<DomainException>(() => article.Publish(CreatedAt.AddHours(1)));

        Assert.Contains(fieldName, exception.Message, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("'de'", exception.Message, StringComparison.Ordinal);
        Assert.Equal(ArticleStatus.Draft, article.Status);
        Assert.Null(article.PublishedAtUtc);
        Assert.Empty(article.DomainEvents);
    }

    [Fact]
    public void Publish_Rejects_a_second_publication()
    {
        var article = CreatePublishableDraft();
        article.Publish(CreatedAt.AddHours(1));

        Assert.Throws<DomainException>(() => article.Publish(CreatedAt.AddHours(2)));
        Assert.Single(article.DomainEvents);
    }

    [Fact]
    public void Withdraw_Returns_a_published_article_to_draft_and_records_the_business_fact()
    {
        var article = CreatePublishableDraft();
        article.Publish(CreatedAt.AddHours(1));
        article.ClearDomainEvents();
        var withdrawnAt = CreatedAt.AddHours(2);

        article.Withdraw(withdrawnAt);

        Assert.Equal(ArticleStatus.Draft, article.Status);
        Assert.Null(article.PublishedAtUtc);
        var withdrawn = Assert.IsType<ArticleWithdrawn>(Assert.Single(article.DomainEvents));
        Assert.Equal(article.Id, withdrawn.ArticleId);
        Assert.Equal(withdrawnAt, withdrawn.OccurredAtUtc);
    }

    [Fact]
    public void Withdraw_Rejects_a_draft_article()
    {
        var article = CreatePublishableDraft();

        Assert.Throws<DomainException>(() => article.Withdraw(CreatedAt.AddHours(1)));
        Assert.Empty(article.DomainEvents);
    }

    [Fact]
    public void CreateDraft_Normalizes_and_deduplicates_tags()
    {
        var article = CreatePublishableDraft([" .NET ", "ddd", ".net", ""]);

        Assert.Equal([".net", "ddd"], article.Tags);
    }

    private static Article CreatePublishableDraft(IEnumerable<string>? tags = null) =>
        Article.CreateDraft(
            Guid.NewGuid(),
            Slug.Create("domain-driven-portfolio"),
            LocalizedText.Create(("en", "A domain-driven portfolio"), ("fa", "پورتفولیوی دامنه‌محور")),
            LocalizedText.Create(("en", "A concise summary that is ready for publication.")),
            LocalizedText.Create(("en", new string('a', Article.MinimumBodyLength))),
            tags ?? ["ddd", ".net"],
            CreatedAt);

    private static Article CreateDraftWithGermanFieldLength(string fieldName, int translationLength) =>
        Article.CreateDraft(
            Guid.NewGuid(),
            Slug.Create("localized-domain-invariants"),
            LocalizedText.Create(
                ("en", "A domain-driven portfolio"),
                ("de", new string('t', fieldName == "title" ? translationLength : Article.MinimumTitleLength))),
            LocalizedText.Create(
                ("en", "A concise summary that is ready for publication."),
                ("de", new string('s', fieldName == "summary" ? translationLength : Article.MinimumSummaryLength))),
            LocalizedText.Create(
                ("en", new string('a', Article.MinimumBodyLength)),
                ("de", new string('b', fieldName == "body" ? translationLength : Article.MinimumBodyLength))),
            ["ddd"],
            CreatedAt);
}
