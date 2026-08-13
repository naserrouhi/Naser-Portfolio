using Microsoft.AspNetCore.Http.HttpResults;
using NaserPortfolio.Application.Articles;
using NaserPortfolio.Application.Overview;

namespace NaserPortfolio.Api.Endpoints;

public static class PortfolioEndpoints
{
    public static IEndpointRouteBuilder MapPortfolioEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var api = endpoints
            .MapGroup("/api/v1")
            .WithTags("Portfolio");

        api.MapGet("/overview", GetOverviewAsync)
            .WithName("GetPortfolioOverviewV1")
            .WithSummary("Returns the résumé-backed profile and curated public projects.")
            .Produces<OverviewDto>()
            .CacheOutput("portfolio-overview");

        api.MapGet("/articles", GetArticlesAsync)
            .WithName("GetPublishedArticlesV1")
            .WithSummary("Returns published article summaries in the requested language with English fallback.")
            .Produces<IReadOnlyList<ArticleSummaryDto>>()
            .CacheOutput("article-list");

        api.MapGet("/articles/{slug}", GetArticleAsync)
            .WithName("GetPublishedArticleV1")
            .WithSummary("Returns one published article by SEO-friendly slug.")
            .Produces<ArticleDetailsDto>()
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .CacheOutput("article-detail");

        return endpoints;
    }

    private static async Task<Ok<OverviewDto>> GetOverviewAsync(
        GetPortfolioOverviewQueryHandler handler,
        CancellationToken cancellationToken) =>
        TypedResults.Ok(await handler.HandleAsync(cancellationToken));

    private static async Task<Ok<IReadOnlyList<ArticleSummaryDto>>> GetArticlesAsync(
        string? language,
        GetPublishedArticlesQueryHandler handler,
        CancellationToken cancellationToken) =>
        TypedResults.Ok(await handler.HandleAsync(
            new GetPublishedArticlesQuery(language),
            cancellationToken));

    private static async Task<Results<Ok<ArticleDetailsDto>, ProblemHttpResult>> GetArticleAsync(
        string slug,
        string? language,
        GetArticleBySlugQueryHandler handler,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var article = await handler.HandleAsync(
            new GetArticleBySlugQuery(slug, language),
            cancellationToken);

        return article is null
            ? TypedResults.Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Article not found",
                detail: $"No published article exists for slug '{slug}'.",
                instance: httpContext.Request.Path)
            : TypedResults.Ok(article);
    }
}
