using NaserPortfolio.Application.Overview;
using NaserPortfolio.Domain.Articles;

namespace NaserPortfolio.Api.IntegrationTests;

public sealed class ArchitectureTests
{
    [Fact]
    public void Domain_has_no_outward_project_dependencies()
    {
        var referencedProjects = GetNaserPortfolioReferences(typeof(Article).Assembly);

        Assert.DoesNotContain("NaserPortfolio.Application", referencedProjects);
        Assert.DoesNotContain("NaserPortfolio.Infrastructure", referencedProjects);
        Assert.DoesNotContain("NaserPortfolio.Api", referencedProjects);
    }

    [Fact]
    public void Application_depends_on_domain_but_not_on_adapters_or_api()
    {
        var referencedProjects = GetNaserPortfolioReferences(typeof(GetPortfolioOverviewQueryHandler).Assembly);

        Assert.Contains("NaserPortfolio.Domain", referencedProjects);
        Assert.DoesNotContain("NaserPortfolio.Infrastructure", referencedProjects);
        Assert.DoesNotContain("NaserPortfolio.Api", referencedProjects);
    }

    private static IReadOnlyList<string> GetNaserPortfolioReferences(System.Reflection.Assembly assembly) =>
        assembly.GetReferencedAssemblies()
            .Select(static reference => reference.Name)
            .Where(static name => name?.StartsWith("NaserPortfolio.", StringComparison.Ordinal) is true)
            .Cast<string>()
            .ToArray();
}
