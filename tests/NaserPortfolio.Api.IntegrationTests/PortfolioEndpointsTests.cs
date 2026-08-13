using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using NaserPortfolio.Application.Articles;
using NaserPortfolio.Application.Overview;

namespace NaserPortfolio.Api.IntegrationTests;

public sealed class PortfolioEndpointsTests
{
    [Fact]
    public async Task Overview_returns_verified_profile_and_curated_projects()
    {
        await using var factory = new PortfolioApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/overview");
        var overview = await response.Content.ReadFromJsonAsync<OverviewDto>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(overview);
        Assert.Equal("Naser Rouhi", overview.Profile.Name);
        Assert.Equal("naserrouhi.nomonia@gmail.com", overview.Profile.Email);
        Assert.Equal("+98 912 806 1286", overview.Profile.Phone);
        Assert.Collection(
            overview.Profile.Experience,
            static item => Assert.Equal("Frontline Data Solutions", item.Company),
            static item => Assert.Equal("Alibaba Travels Co.", item.Company),
            static item => Assert.Equal("Porter Airlines · Car Media · FreightNav", item.Company),
            static item => Assert.Equal("Asa Co. (Agah Broker)", item.Company),
            static item => Assert.Equal("Geeks Ltd", item.Company),
            static item => Assert.Equal("MyDigipay (Digikala Group)", item.Company));
        Assert.Contains(
            overview.Profile.Experience[0].Highlights,
            static highlight => highlight.Contains(
                "cutting average issue resolution time by over 40%",
                StringComparison.Ordinal));
        Assert.Equal(
            "Found a passion for software during academic programming courses, which led to a full career transition into tech.",
            overview.Profile.Education.Description);
        Assert.Equal("Tehran, Iran", overview.Profile.Education.Location);
        Assert.Single(overview.Profile.Awards);
        Assert.Equal("English", overview.Profile.Languages[0].Name);
        Assert.Equal(7, overview.Profile.SkillGroups.Count);
        Assert.Equal(5, overview.Profile.KeyProjects.Count);
        Assert.Contains(overview.GitHubRepositories, static project => project.Name == "Daveslist");
        Assert.Contains(overview.Profile.Experience, static item =>
            item.Company == "Porter Airlines · Car Media · FreightNav" &&
            item.Role.Contains("Part-time", StringComparison.Ordinal));
    }

    [Fact]
    public async Task Overview_contract_separates_resume_projects_from_github_repositories()
    {
        await using var factory = new PortfolioApiFactory();
        using var client = factory.CreateClient();

        var overview = await client.GetFromJsonAsync<JsonElement>("/api/v1/overview");

        Assert.True(
            overview.TryGetProperty("githubRepositories", out var repositories),
            string.Join(", ", overview.EnumerateObject().Select(static property => property.Name)));
        Assert.Equal(JsonValueKind.Array, repositories.ValueKind);
        Assert.False(overview.TryGetProperty("projects", out _));

        var profile = overview.GetProperty("profile");
        Assert.True(profile.TryGetProperty("keyProjects", out var keyProjects));
        Assert.Equal(5, keyProjects.GetArrayLength());
        Assert.False(profile.TryGetProperty("selectedWork", out _));
        Assert.True(profile.TryGetProperty("awards", out var awards));
        Assert.Equal(1, awards.GetArrayLength());
        Assert.False(string.IsNullOrWhiteSpace(
            profile.GetProperty("education").GetProperty("description").GetString()));
    }

    [Fact]
    public async Task Articles_return_localized_content_with_a_transparent_publication_notice()
    {
        await using var factory = new PortfolioApiFactory();
        using var client = factory.CreateClient();

        var list = await client.GetFromJsonAsync<IReadOnlyList<ArticleSummaryDto>>(
            "/api/v1/articles?language=fa");
        var article = await client.GetFromJsonAsync<ArticleDetailsDto>(
            "/api/v1/articles/portfolio-workbench-case-study?language=fa-IR");

        var summary = Assert.Single(Assert.IsAssignableFrom<IReadOnlyList<ArticleSummaryDto>>(list));
        Assert.Equal("fa", summary.Language);
        Assert.Contains("نه مقاله‌ای قدیمی", summary.Summary, StringComparison.Ordinal);
        Assert.NotNull(article);
        Assert.Equal("fa", article.Language);
        Assert.Contains("سال ۲۰۲۶", article.Body, StringComparison.Ordinal);
        Assert.Contains("en", article.AvailableLanguages);
        Assert.Contains("nl", article.AvailableLanguages);
    }

    [Fact]
    public async Task Missing_article_returns_problem_details()
    {
        await using var factory = new PortfolioApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/articles/not-published");
        var problem = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("Article not found", problem.GetProperty("title").GetString());
        Assert.Equal(404, problem.GetProperty("status").GetInt32());
    }

    [Fact]
    public async Task Invalid_slug_returns_bad_request_problem_details()
    {
        await using var factory = new PortfolioApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/articles/invalid%40slug");
        var problem = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("Invalid request", problem.GetProperty("title").GetString());
        Assert.True(problem.TryGetProperty("traceId", out _));
    }

    [Fact]
    public async Task Health_and_openapi_endpoints_are_available()
    {
        await using var factory = new PortfolioApiFactory();
        using var client = factory.CreateClient();

        var health = await client.GetAsync("/health");
        var openApi = await client.GetAsync("/openapi/v1.json");
        var document = await openApi.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.OK, health.StatusCode);
        Assert.Equal("Healthy", await health.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, openApi.StatusCode);
        var paths = document.GetProperty("paths");
        Assert.True(paths.TryGetProperty("/api/v1/overview", out _));
        Assert.True(paths.TryGetProperty("/api/v1/articles/{slug}", out _));
        Assert.False(paths.TryGetProperty("/weatherforecast", out _));
    }

    [Fact]
    public async Task Swagger_ui_is_available_in_development()
    {
        await using var factory = new PortfolioApiFactory("Development");
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/swagger/index.html");
        var html = await response.Content.ReadAsStringAsync();
        var initializer = await client.GetStringAsync("/swagger/index.js");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("Naser Portfolio API", html, StringComparison.Ordinal);
        Assert.Contains("index.js", html, StringComparison.Ordinal);
        Assert.Contains("/openapi/v1.json", initializer, StringComparison.Ordinal);
        Assert.Contains("Naser Portfolio API v1", initializer, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Overview_output_is_cached()
    {
        await using var factory = new PortfolioApiFactory();
        using var client = factory.CreateClient();

        using var first = await client.GetAsync("/api/v1/overview");
        using var second = await client.GetAsync("/api/v1/overview");

        first.EnsureSuccessStatusCode();
        second.EnsureSuccessStatusCode();
        Assert.Equal(1, factory.ProjectProvider.CallCount);
    }
}
