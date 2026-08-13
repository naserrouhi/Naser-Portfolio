using NaserPortfolio.Domain.Articles;

namespace NaserPortfolio.Domain.Tests.Articles;

public sealed class SlugTests
{
    [Theory]
    [InlineData("Building Resilient APIs", "building-resilient-apis")]
    [InlineData("  DDD__with   NET  ", "ddd-with-net")]
    [InlineData("dotnet-10", "dotnet-10")]
    public void Create_Normalizes_supported_input(string input, string expected)
    {
        var slug = Slug.Create(input);

        Assert.Equal(expected, slug.Value);
    }

    [Theory]
    [InlineData("persian-مقاله")]
    [InlineData("starts-#-symbol")]
    [InlineData("-leading")]
    public void Create_Rejects_non_ascii_or_malformed_input(string input)
    {
        Assert.Throws<ArgumentException>(() => Slug.Create(input));
    }
}
