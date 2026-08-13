using System.Net.Http.Headers;
using Microsoft.Extensions.DependencyInjection;
using NaserPortfolio.Application.Profiles;
using NaserPortfolio.Application.Projects;
using NaserPortfolio.Domain.Articles;
using NaserPortfolio.Infrastructure.Articles;
using NaserPortfolio.Infrastructure.Profiles;
using NaserPortfolio.Infrastructure.Projects;

namespace NaserPortfolio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddMemoryCache();
        services.AddSingleton<IProfileProvider, ResumeProfileProvider>();
        services.AddSingleton<IArticleRepository, InMemoryArticleRepository>();

        services.AddHttpClient<IProjectProvider, GitHubProjectProvider>(client =>
        {
            client.BaseAddress = new Uri("https://api.github.com/");
            client.Timeout = TimeSpan.FromSeconds(4);
            client.DefaultRequestHeaders.UserAgent.Add(
                new ProductInfoHeaderValue("NaserPortfolio", "1.0"));
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
            client.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");
        });

        return services;
    }
}
