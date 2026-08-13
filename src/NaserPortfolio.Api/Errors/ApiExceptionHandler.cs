using Microsoft.AspNetCore.Diagnostics;
using NaserPortfolio.Domain.Common;

namespace NaserPortfolio.Api.Errors;

public sealed class ApiExceptionHandler(
    IProblemDetailsService problemDetailsService,
    ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, title, detail, logLevel) = exception switch
        {
            ArgumentException => (
                StatusCodes.Status400BadRequest,
                "Invalid request",
                exception.Message,
                LogLevel.Information),
            DomainException => (
                StatusCodes.Status422UnprocessableEntity,
                "Business rule rejected the request",
                exception.Message,
                LogLevel.Information),
            _ => (
                StatusCodes.Status500InternalServerError,
                "An unexpected error occurred",
                "The server could not complete the request.",
                LogLevel.Error)
        };

        logger.Log(
            logLevel,
            exception,
            "Request {Method} {Path} failed with status {StatusCode}.",
            httpContext.Request.Method,
            httpContext.Request.Path,
            statusCode);

        httpContext.Response.StatusCode = statusCode;
        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new Microsoft.AspNetCore.Mvc.ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = detail,
                Instance = httpContext.Request.Path
            }
        });
    }
}
