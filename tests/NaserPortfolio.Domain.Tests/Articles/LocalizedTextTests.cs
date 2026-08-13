using NaserPortfolio.Domain.Articles;

namespace NaserPortfolio.Domain.Tests.Articles;

public sealed class LocalizedTextTests
{
    [Fact]
    public void Resolve_Uses_exact_then_neutral_language()
    {
        var text = LocalizedText.Create(
            ("en", "English"),
            ("fa", "فارسی"));

        var resolved = text.Resolve("fa-IR");

        Assert.Equal("fa", resolved.Language);
        Assert.Equal("فارسی", resolved.Value);
    }

    [Fact]
    public void Resolve_Uses_english_as_the_default_fallback()
    {
        var text = LocalizedText.Create(
            ("de", "Deutsch"),
            ("en", "English"));

        var resolved = text.Resolve("fr");

        Assert.Equal("en", resolved.Language);
        Assert.Equal("English", resolved.Value);
    }

    [Fact]
    public void Create_Rejects_duplicate_normalized_languages()
    {
        Assert.Throws<ArgumentException>(() =>
            LocalizedText.Create(("en", "First"), ("EN", "Second")));
    }
}
