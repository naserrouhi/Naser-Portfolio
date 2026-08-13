using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NaserPortfolio.Application.Projects;

namespace NaserPortfolio.Api.IntegrationTests;

public sealed class PortfolioApiFactory : WebApplicationFactory<Program>
{
    private readonly string _environment;

    public PortfolioApiFactory(string environment = "Testing")
    {
        _environment = environment;
    }

    public CountingProjectProvider ProjectProvider { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment(_environment);
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<IProjectProvider>();
            services.AddSingleton<IProjectProvider>(ProjectProvider);
        });
    }
}

public sealed class CountingProjectProvider : IProjectProvider
{
    private int _callCount;

    public int CallCount => Volatile.Read(ref _callCount);

    public Task<IReadOnlyList<ProjectSnapshot>> GetFeaturedAsync(
        CancellationToken cancellationToken = default)
    {
        Interlocked.Increment(ref _callCount);

        IReadOnlyList<ProjectSnapshot> projects =
        [
            new(
                "daveslist",
                "Daveslist",
                "DDD-oriented .NET 8 API",
                "https://github.com/naserrouhi/Daveslist",
                null,
                "C#",
                [".NET 8", "DDD", "xUnit"],
                1,
                new DateTimeOffset(2025, 8, 28, 19, 28, 44, TimeSpan.Zero),
                true,
                "Deterministic integration-test project")
        ];

        return Task.FromResult(projects);
    }
}
