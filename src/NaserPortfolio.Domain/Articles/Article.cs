using System.Collections.ObjectModel;
using NaserPortfolio.Domain.Common;

namespace NaserPortfolio.Domain.Articles;

public sealed class Article
{
    public const int MinimumTitleLength = 3;
    public const int MaximumTitleLength = 120;
    public const int MinimumSummaryLength = 20;
    public const int MaximumSummaryLength = 320;
    public const int MinimumBodyLength = 80;

    private readonly List<IDomainEvent> _domainEvents = [];
    private readonly IReadOnlyList<string> _tags;

    private Article(
        Guid id,
        Slug slug,
        LocalizedText title,
        LocalizedText summary,
        LocalizedText body,
        IReadOnlyList<string> tags,
        DateTimeOffset createdAtUtc)
    {
        Id = id;
        Slug = slug;
        Title = title;
        Summary = summary;
        Body = body;
        _tags = tags;
        CreatedAtUtc = createdAtUtc;
        Status = ArticleStatus.Draft;
    }

    public Guid Id { get; }
    public Slug Slug { get; }
    public LocalizedText Title { get; }
    public LocalizedText Summary { get; }
    public LocalizedText Body { get; }
    public IReadOnlyList<string> Tags => _tags;
    public ArticleStatus Status { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; }
    public DateTimeOffset? PublishedAtUtc { get; private set; }
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    public static Article CreateDraft(
        Guid id,
        Slug slug,
        LocalizedText title,
        LocalizedText summary,
        LocalizedText body,
        IEnumerable<string> tags,
        DateTimeOffset createdAtUtc)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("An article id cannot be empty.", nameof(id));
        }

        ArgumentNullException.ThrowIfNull(slug);
        ArgumentNullException.ThrowIfNull(title);
        ArgumentNullException.ThrowIfNull(summary);
        ArgumentNullException.ThrowIfNull(body);
        ArgumentNullException.ThrowIfNull(tags);

        return new Article(id, slug, title, summary, body, NormalizeTags(tags), createdAtUtc);
    }

    public void Publish(DateTimeOffset publishedAtUtc)
    {
        if (Status == ArticleStatus.Published)
        {
            throw new DomainException("The article is already published.");
        }

        if (publishedAtUtc < CreatedAtUtc)
        {
            throw new DomainException("An article cannot be published before it was created.");
        }

        EnsurePublishableContent(Title, nameof(Title), MinimumTitleLength, MaximumTitleLength);
        EnsurePublishableContent(Summary, nameof(Summary), MinimumSummaryLength, MaximumSummaryLength);
        EnsurePublishableContent(Body, nameof(Body), MinimumBodyLength, LocalizedText.MaximumTranslationLength);

        Status = ArticleStatus.Published;
        PublishedAtUtc = publishedAtUtc;
        _domainEvents.Add(new ArticlePublished(Id, Slug.Value, publishedAtUtc));
    }

    public void Withdraw(DateTimeOffset withdrawnAtUtc)
    {
        if (Status != ArticleStatus.Published || PublishedAtUtc is null)
        {
            throw new DomainException("Only a published article can be withdrawn.");
        }

        if (withdrawnAtUtc < PublishedAtUtc.Value)
        {
            throw new DomainException("An article cannot be withdrawn before it was published.");
        }

        Status = ArticleStatus.Draft;
        PublishedAtUtc = null;
        _domainEvents.Add(new ArticleWithdrawn(Id, Slug.Value, withdrawnAtUtc));
    }

    public void ClearDomainEvents() => _domainEvents.Clear();

    private static ReadOnlyCollection<string> NormalizeTags(IEnumerable<string> tags)
    {
        var normalizedTags = tags
            .Select(static tag => tag?.Trim().ToLowerInvariant())
            .Where(static tag => !string.IsNullOrWhiteSpace(tag))
            .Distinct(StringComparer.Ordinal)
            .Order(StringComparer.Ordinal)
            .Cast<string>()
            .ToList();

        return normalizedTags.AsReadOnly();
    }

    private static void EnsurePublishableContent(
        LocalizedText text,
        string fieldName,
        int minimumLength,
        int maximumLength)
    {
        if (!text.Contains(LocalizedText.DefaultLanguage))
        {
            throw new DomainException($"{fieldName} requires an English translation before publication.");
        }

        foreach (var language in text.Languages)
        {
            var translation = text.Resolve(language).Value;
            if (translation.Length < minimumLength || translation.Length > maximumLength)
            {
                throw new DomainException(
                    $"The {fieldName.ToLowerInvariant()} translation '{language}' must contain " +
                    $"{minimumLength}-{maximumLength} characters.");
            }
        }
    }
}
