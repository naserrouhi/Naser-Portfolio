using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using NaserPortfolio.Application.Projects;

namespace NaserPortfolio.Infrastructure.Projects;

public sealed class GitHubProjectProvider(
    HttpClient httpClient,
    IMemoryCache memoryCache,
    ILogger<GitHubProjectProvider> logger) : IProjectProvider
{
    private const string CacheKey = "github:projects:naserrouhi:v1";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(30);

    private static readonly IReadOnlyList<ProjectSnapshot> CuratedFallback =
    [
        new(
            "daveslist",
            "Daveslist",
            "A .NET 8 classifieds-style API demonstrating domain modeling, layered architecture, repositories, domain events, Identity, EF Core, and automated tests.",
            "https://github.com/naserrouhi/Daveslist",
            null,
            "C#",
            [".NET 8", "ASP.NET Core", "DDD", "EF Core", "SQL Server", "xUnit"],
            1,
            new DateTimeOffset(2025, 8, 28, 19, 28, 44, TimeSpan.Zero),
            true,
            "Public source repository; curated fallback verified from GitHub on 2026-08-08."),
        new(
            "code-contest-hub",
            "CodeContestHub",
            "A C# collection of Codewars and HackerRank exercises with paired .NET 8 xUnit test projects for algorithms and object-oriented design.",
            "https://github.com/naserrouhi/CodeContestHub",
            null,
            "C#",
            ["C#", ".NET 8", "Algorithms", "OOP", "xUnit"],
            4,
            new DateTimeOffset(2024, 11, 11, 14, 20, 17, TimeSpan.Zero),
            true,
            "Public source repository; curated fallback verified from GitHub on 2026-08-08."),
        new(
            "resume",
            "Machine-readable Résumé",
            "A JSON Resume source of truth with npm validation, HTML export, and a GitHub Actions validation workflow.",
            "https://github.com/naserrouhi/Resume",
            null,
            "JSON",
            ["JSON Resume", "GitHub Actions", "Node.js", "CI"],
            1,
            new DateTimeOffset(2026, 8, 8, 1, 27, 36, TimeSpan.Zero),
            true,
            "Public source repository; curated fallback verified from GitHub on 2026-08-08."),
        new(
            "code-mastery-qa",
            "CodeMastery Q&A",
            "A curated technical question-and-answer collection covering .NET, .NET Core, and JavaScript.",
            "https://github.com/naserrouhi/CodeMastery-QA",
            null,
            "Markdown",
            [".NET", ".NET Core", "JavaScript", "Technical Writing"],
            3,
            new DateTimeOffset(2025, 9, 2, 14, 34, 11, TimeSpan.Zero),
            false,
            "Curated learning material; it is not represented as an authored article collection.")
    ];

    public async Task<IReadOnlyList<ProjectSnapshot>> GetFeaturedAsync(
        CancellationToken cancellationToken = default)
    {
        if (memoryCache.TryGetValue(CacheKey, out IReadOnlyList<ProjectSnapshot>? cachedProjects) &&
            cachedProjects is not null)
        {
            return cachedProjects;
        }

        IReadOnlyList<ProjectSnapshot> projects;
        try
        {
            var repositories = await httpClient.GetFromJsonAsync<List<GitHubRepository>>(
                "users/naserrouhi/repos?per_page=100&sort=updated",
                cancellationToken);

            projects = MergeLiveMetadata(repositories ?? []);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            logger.LogWarning("GitHub project metadata timed out; serving the curated snapshot.");
            projects = CuratedFallback;
        }
        catch (HttpRequestException exception)
        {
            logger.LogWarning(exception, "GitHub project metadata was unavailable; serving the curated snapshot.");
            projects = CuratedFallback;
        }
        catch (NotSupportedException exception)
        {
            logger.LogWarning(exception, "GitHub returned an unsupported payload; serving the curated snapshot.");
            projects = CuratedFallback;
        }
        catch (System.Text.Json.JsonException exception)
        {
            logger.LogWarning(exception, "GitHub returned invalid JSON; serving the curated snapshot.");
            projects = CuratedFallback;
        }

        memoryCache.Set(CacheKey, projects, CacheDuration);
        return projects;
    }

    private static IReadOnlyList<ProjectSnapshot> MergeLiveMetadata(
        IReadOnlyCollection<GitHubRepository> repositories)
    {
        var repositoriesByName = repositories
            .Where(static repository => !repository.Fork && !repository.Archived)
            .ToDictionary(static repository => repository.Name, StringComparer.OrdinalIgnoreCase);

        return CuratedFallback
            .Select(project => repositoriesByName.TryGetValue(GetRepositoryName(project.RepositoryUrl), out var live)
                ? project with
                {
                    RepositoryUrl = live.HtmlUrl ?? project.RepositoryUrl,
                    PrimaryLanguage = live.Language ?? project.PrimaryLanguage,
                    Stars = live.StargazersCount,
                    LastPushedAtUtc = live.PushedAtUtc
                }
                : project)
            .ToArray();
    }

    private static string GetRepositoryName(string repositoryUrl) =>
        repositoryUrl[(repositoryUrl.LastIndexOf('/') + 1)..];

    private sealed record GitHubRepository
    {
        [JsonPropertyName("name")]
        public required string Name { get; init; }

        [JsonPropertyName("html_url")]
        public string? HtmlUrl { get; init; }

        [JsonPropertyName("language")]
        public string? Language { get; init; }

        [JsonPropertyName("stargazers_count")]
        public int StargazersCount { get; init; }

        [JsonPropertyName("pushed_at")]
        public DateTimeOffset? PushedAtUtc { get; init; }

        [JsonPropertyName("fork")]
        public bool Fork { get; init; }

        [JsonPropertyName("archived")]
        public bool Archived { get; init; }
    }
}
