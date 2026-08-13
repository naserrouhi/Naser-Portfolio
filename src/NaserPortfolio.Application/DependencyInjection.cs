using Microsoft.Extensions.DependencyInjection;
using NaserPortfolio.Application.Articles;
using NaserPortfolio.Application.Overview;

namespace NaserPortfolio.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<GetPortfolioOverviewQueryHandler>();
        services.AddScoped<GetPublishedArticlesQueryHandler>();
        services.AddScoped<GetArticleBySlugQueryHandler>();

        return services;
    }
}
