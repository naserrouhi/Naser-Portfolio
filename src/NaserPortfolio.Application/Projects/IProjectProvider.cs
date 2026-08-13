namespace NaserPortfolio.Application.Projects;

public interface IProjectProvider
{
    Task<IReadOnlyList<ProjectSnapshot>> GetFeaturedAsync(
        CancellationToken cancellationToken = default);
}
