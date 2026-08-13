namespace NaserPortfolio.Application.Profiles;

public interface IProfileProvider
{
    Task<ProfileSnapshot> GetAsync(CancellationToken cancellationToken = default);
}
