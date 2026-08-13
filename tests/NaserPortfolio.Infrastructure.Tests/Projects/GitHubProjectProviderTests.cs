using System.Net;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using NaserPortfolio.Application.Projects;
using NaserPortfolio.Infrastructure.Projects;

namespace NaserPortfolio.Infrastructure.Tests.Projects;

public sealed class GitHubProjectProviderTests
{
    [Fact]
    public async Task GetFeaturedAsync_maps_live_metadata_onto_curated_projects()
    {
        Uri? requestedUri = null;
        var handler = new StubHttpMessageHandler((request, _) =>
        {
            requestedUri = request.RequestUri;
            return Task.FromResult(JsonResponse(LiveRepositoriesJson(stars: 42)));
        });

        using var cache = new MemoryCache(new MemoryCacheOptions());
        using var httpClient = CreateHttpClient(handler);
        var sut = CreateProvider(httpClient, cache);

        var projects = await sut.GetFeaturedAsync();

        var daveslist = Assert.Single(projects, static project => project.Slug == "daveslist");
        Assert.Equal("https://github.com/naserrouhi/Daveslist-live", daveslist.RepositoryUrl);
        Assert.Equal("F#", daveslist.PrimaryLanguage);
        Assert.Equal(42, daveslist.Stars);
        Assert.Equal(new DateTimeOffset(2026, 7, 1, 12, 30, 0, TimeSpan.Zero), daveslist.LastPushedAtUtc);
        Assert.Contains("domain modeling", daveslist.Summary, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("DDD", daveslist.Technologies);

        var forkedRepository = Assert.Single(
            projects,
            static project => project.Slug == "code-contest-hub");
        Assert.Equal(4, forkedRepository.Stars);

        Assert.Equal(
            "https://api.github.test/users/naserrouhi/repos?per_page=100&sort=updated",
            requestedUri?.AbsoluteUri);
    }

    [Theory]
    [InlineData(HttpStatusCode.Forbidden)]
    [InlineData(HttpStatusCode.TooManyRequests)]
    [InlineData(HttpStatusCode.InternalServerError)]
    public async Task GetFeaturedAsync_uses_curated_snapshot_when_github_returns_an_error(
        HttpStatusCode statusCode)
    {
        var handler = new StubHttpMessageHandler((_, _) =>
            Task.FromResult(new HttpResponseMessage(statusCode)));

        using var cache = new MemoryCache(new MemoryCacheOptions());
        using var httpClient = CreateHttpClient(handler);
        var sut = CreateProvider(httpClient, cache);

        var projects = await sut.GetFeaturedAsync();

        AssertCuratedFallback(projects);
    }

    [Fact]
    public async Task GetFeaturedAsync_uses_curated_snapshot_when_github_returns_malformed_json()
    {
        var handler = new StubHttpMessageHandler((_, _) =>
            Task.FromResult(JsonResponse("{ not-valid-json")));

        using var cache = new MemoryCache(new MemoryCacheOptions());
        using var httpClient = CreateHttpClient(handler);
        var sut = CreateProvider(httpClient, cache);

        var projects = await sut.GetFeaturedAsync();

        AssertCuratedFallback(projects);
    }

    [Fact]
    public async Task GetFeaturedAsync_uses_curated_snapshot_when_github_times_out()
    {
        var handler = new StubHttpMessageHandler(async (_, cancellationToken) =>
        {
            await Task.Delay(Timeout.InfiniteTimeSpan, cancellationToken);
            throw new InvalidOperationException("The infinite delay should be cancelled by HttpClient.Timeout.");
        });

        using var cache = new MemoryCache(new MemoryCacheOptions());
        using var httpClient = CreateHttpClient(handler, TimeSpan.FromMilliseconds(50));
        var sut = CreateProvider(httpClient, cache);

        var projects = await sut.GetFeaturedAsync();

        AssertCuratedFallback(projects);
    }

    [Fact]
    public async Task GetFeaturedAsync_reuses_cached_metadata_without_a_second_http_request()
    {
        var requestCount = 0;
        var handler = new StubHttpMessageHandler((_, _) =>
        {
            requestCount++;
            return Task.FromResult(JsonResponse(LiveRepositoriesJson(stars: 99)));
        });

        using var cache = new MemoryCache(new MemoryCacheOptions());
        using var httpClient = CreateHttpClient(handler);
        var sut = CreateProvider(httpClient, cache);

        var first = await sut.GetFeaturedAsync();
        var second = await sut.GetFeaturedAsync();

        Assert.Equal(1, requestCount);
        Assert.Same(first, second);
        Assert.Equal(99, Assert.Single(second, static project => project.Slug == "daveslist").Stars);
    }

    private static GitHubProjectProvider CreateProvider(HttpClient httpClient, IMemoryCache cache) =>
        new(httpClient, cache, NullLogger<GitHubProjectProvider>.Instance);

    private static HttpClient CreateHttpClient(
        HttpMessageHandler handler,
        TimeSpan? timeout = null) =>
        new(handler)
        {
            BaseAddress = new Uri("https://api.github.test/"),
            Timeout = timeout ?? TimeSpan.FromSeconds(5)
        };

    private static HttpResponseMessage JsonResponse(string json) =>
        new(HttpStatusCode.OK)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

    private static string LiveRepositoriesJson(int stars) => $$"""
        [
          {
            "name": "Daveslist",
            "html_url": "https://github.com/naserrouhi/Daveslist-live",
            "language": "F#",
            "stargazers_count": {{stars}},
            "pushed_at": "2026-07-01T12:30:00Z",
            "fork": false,
            "archived": false
          },
          {
            "name": "CodeContestHub",
            "html_url": "https://github.com/naserrouhi/CodeContestHub-fork",
            "language": "Visual Basic",
            "stargazers_count": 500,
            "pushed_at": "2026-07-02T12:30:00Z",
            "fork": true,
            "archived": false
          }
        ]
        """;

    private static void AssertCuratedFallback(IReadOnlyList<ProjectSnapshot> projects)
    {
        Assert.Equal(4, projects.Count);
        var daveslist = Assert.Single(projects, static project => project.Slug == "daveslist");
        Assert.Equal("https://github.com/naserrouhi/Daveslist", daveslist.RepositoryUrl);
        Assert.Equal("C#", daveslist.PrimaryLanguage);
        Assert.Equal(1, daveslist.Stars);
        Assert.Equal(
            new DateTimeOffset(2025, 8, 28, 19, 28, 44, TimeSpan.Zero),
            daveslist.LastPushedAtUtc);
    }

    private sealed class StubHttpMessageHandler(
        Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> responseFactory)
        : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken) =>
            responseFactory(request, cancellationToken);
    }
}
