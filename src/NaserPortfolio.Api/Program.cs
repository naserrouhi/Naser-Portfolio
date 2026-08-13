using NaserPortfolio.Api.Endpoints;
using NaserPortfolio.Api.Errors;
using NaserPortfolio.Application;
using NaserPortfolio.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure();

builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
        context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;
});
builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddHealthChecks();
builder.Services.AddOpenApi();

builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("portfolio-overview", policy =>
        policy.Expire(TimeSpan.FromMinutes(5)));
    options.AddPolicy("article-list", policy =>
        policy.Expire(TimeSpan.FromMinutes(5)).SetVaryByQuery("language"));
    options.AddPolicy("article-detail", policy =>
        policy.Expire(TimeSpan.FromMinutes(10)).SetVaryByQuery("language"));
});

var configuredOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .GetChildren()
    .Select(static child => child.Value)
    .Where(static value => !string.IsNullOrWhiteSpace(value))
    .Cast<string>()
    .ToArray();

builder.Services.AddCors(options => options.AddPolicy("portfolio-web", policy =>
{
    if (configuredOrigins.Length > 0)
    {
        policy.WithOrigins(configuredOrigins).AllowAnyHeader().AllowAnyMethod();
    }
}));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI(options =>
    {
        options.RoutePrefix = "swagger";
        options.SwaggerEndpoint("/openapi/v1.json", "Naser Portfolio API v1");
        options.DocumentTitle = "Naser Portfolio API";
        options.DisplayRequestDuration();
        options.EnableTryItOutByDefault();
    });
}

app.UseExceptionHandler();
app.UseCors("portfolio-web");
app.UseOutputCache();

app.MapPortfolioEndpoints();
app.MapHealthChecks("/health").ExcludeFromDescription();
app.MapOpenApi();

app.Run();

public partial class Program;
