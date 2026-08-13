using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NaserPortfolio.Application.Articles;
using NaserPortfolio.Application.Overview;
using NaserPortfolio.Application.Projects;
using Reqnroll;

namespace NaserPortfolio.AcceptanceTests.Steps;

[Binding]
public sealed class PortfolioBrowsingSteps : IDisposable
{
    private AcceptanceApiFactory? _factory;
    private HttpClient? _client;
    private HttpResponseMessage? _response;
    private OverviewDto? _overview;
    private ArticleDetailsDto? _article;

    [Given("the portfolio API is available")]
    public void GivenThePortfolioApiIsAvailable()
    {
        _factory = new AcceptanceApiFactory();
        _client = _factory.CreateClient();
    }

    [When("I request the portfolio overview")]
    public async Task WhenIRequestThePortfolioOverview()
    {
        _response = await Client.GetAsync("/api/v1/overview");
        _overview = await _response.Content.ReadFromJsonAsync<OverviewDto>();
    }

    [Then("the overview identifies Naser Rouhi as a Senior Software Engineer")]
    public void ThenTheOverviewIdentifiesNaserRouhi()
    {
        Assert.Equal(HttpStatusCode.OK, Response.StatusCode);
        Assert.NotNull(_overview);
        Assert.Equal("Naser Rouhi", _overview.Profile.Name);
        Assert.Contains("Senior Software Engineer", _overview.Profile.Headline, StringComparison.Ordinal);
    }

    [Then("the overview publishes the complete six-role career timeline")]
    public void ThenTheOverviewPublishesTheCompleteCareerTimeline()
    {
        Assert.NotNull(_overview);
        Assert.Equal(6, _overview.Profile.Experience.Count);
        Assert.Equal("Frontline Data Solutions", _overview.Profile.Experience[0].Company);
        Assert.Equal("MyDigipay (Digikala Group)", _overview.Profile.Experience[^1].Company);
        Assert.All(_overview.Profile.Experience, static item =>
        {
            Assert.False(string.IsNullOrWhiteSpace(item.Summary));
            Assert.NotEmpty(item.Highlights);
        });
    }

    [Then("the overview provides the resume contact details")]
    public void ThenTheOverviewProvidesTheResumeContactDetails()
    {
        Assert.NotNull(_overview);
        Assert.Equal("naserrouhi.nomonia@gmail.com", _overview.Profile.Email);
        Assert.Equal("+98 912 806 1286", _overview.Profile.Phone);
    }

    [Then("the overview features the public Daveslist repository")]
    public void ThenTheOverviewFeaturesDaveslist()
    {
        Assert.NotNull(_overview);
        Assert.Contains(_overview.GitHubRepositories, static project =>
            project.Name == "Daveslist" &&
            project.RepositoryUrl == "https://github.com/naserrouhi/Daveslist");
    }

    [When("I request the portfolio case study in Persian")]
    public async Task WhenIRequestThePortfolioCaseStudyInPersian()
    {
        _response = await Client.GetAsync(
            "/api/v1/articles/portfolio-workbench-case-study?language=fa");
        _article = await _response.Content.ReadFromJsonAsync<ArticleDetailsDto>();
    }

    [Then("the article is returned in Persian")]
    public void ThenTheArticleIsReturnedInPersian()
    {
        Assert.Equal(HttpStatusCode.OK, Response.StatusCode);
        Assert.NotNull(_article);
        Assert.Equal("fa", _article.Language);
        Assert.Contains("کارگاه پورتفولیو", _article.Title, StringComparison.Ordinal);
    }

    [Then("the article says it documents the 2026 portfolio build")]
    public void ThenTheArticleDocumentsTheCurrentBuild()
    {
        Assert.NotNull(_article);
        Assert.Contains("سال ۲۰۲۶", _article.Body, StringComparison.Ordinal);
        Assert.Contains("مقاله‌ای از گذشته نیست", _article.Body, StringComparison.Ordinal);
    }

    [When("I request an article that has not been published")]
    public async Task WhenIRequestAnUnknownArticle()
    {
        _response = await Client.GetAsync("/api/v1/articles/unknown-article");
    }

    [Then("the API reports that the article was not found")]
    public async Task ThenTheApiReportsNotFound()
    {
        Assert.Equal(HttpStatusCode.NotFound, Response.StatusCode);
        var body = await Response.Content.ReadAsStringAsync();
        Assert.Contains("Article not found", body, StringComparison.Ordinal);
    }

    public void Dispose()
    {
        _response?.Dispose();
        _client?.Dispose();
        _factory?.Dispose();
    }

    private HttpClient Client =>
        _client ?? throw new InvalidOperationException("The API has not been started for this scenario.");

    private HttpResponseMessage Response =>
        _response ?? throw new InvalidOperationException("No API response is available for this scenario.");

    private sealed class AcceptanceApiFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("AcceptanceTesting");
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<IProjectProvider>();
                services.AddSingleton<IProjectProvider, AcceptanceProjectProvider>();
            });
        }
    }

    private sealed class AcceptanceProjectProvider : IProjectProvider
    {
        public Task<IReadOnlyList<ProjectSnapshot>> GetFeaturedAsync(
            CancellationToken cancellationToken = default)
        {
            IReadOnlyList<ProjectSnapshot> projects =
            [
                new(
                    "daveslist",
                    "Daveslist",
                    "A public DDD-oriented .NET 8 API.",
                    "https://github.com/naserrouhi/Daveslist",
                    null,
                    "C#",
                    [".NET 8", "DDD", "xUnit"],
                    1,
                    null,
                    true,
                    "Public source repository")
            ];

            return Task.FromResult(projects);
        }
    }
}
