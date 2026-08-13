using NaserPortfolio.Application.Overview;
using NaserPortfolio.Application.Profiles;
using NaserPortfolio.Application.Projects;

namespace NaserPortfolio.Application.Tests.Overview;

public sealed class GetPortfolioOverviewQueryHandlerTests
{
    [Fact]
    public async Task HandleAsync_Composes_profile_and_curated_projects()
    {
        var profileProvider = new StubProfileProvider(CreateProfile());
        var projectProvider = new StubProjectProvider(
        [
            new ProjectSnapshot(
                "daveslist",
                "Daveslist",
                "DDD-oriented API",
                "https://github.com/naserrouhi/Daveslist",
                null,
                "C#",
                [".NET 8", "DDD"],
                1,
                null,
                true,
                "Public source")
        ]);
        var handler = new GetPortfolioOverviewQueryHandler(profileProvider, projectProvider);

        var result = await handler.HandleAsync(CancellationToken.None);

        Assert.Equal("Naser Rouhi", result.Profile.Name);
        Assert.Equal("+98 912 806 1286", result.Profile.Phone);
        var project = Assert.Single(result.GitHubRepositories);
        Assert.Equal("Daveslist", project.Name);
        Assert.True(project.IsFeatured);
        Assert.Equal(1, profileProvider.CallCount);
        Assert.Equal(1, projectProvider.CallCount);
    }

    private static ProfileSnapshot CreateProfile() =>
        new(
            "Naser Rouhi",
            "Senior Software Engineer",
            "Backend engineer",
            "Tehran, Iran",
            "naser@example.test",
            "+98 912 806 1286",
            8,
            true,
            "https://example.test/avatar",
            "https://example.test/resume",
            [new SocialLinkSnapshot("GitHub", "https://github.com/naserrouhi")],
            [],
            new EducationSnapshot(
                "University",
                "B.Sc.",
                "Engineering",
                "City",
                "2013",
                "2017",
                "Education description"),
            [],
            [],
            [],
            [],
            []);

    private sealed class StubProfileProvider(ProfileSnapshot profile) : IProfileProvider
    {
        public int CallCount { get; private set; }

        public Task<ProfileSnapshot> GetAsync(CancellationToken cancellationToken = default)
        {
            CallCount++;
            return Task.FromResult(profile);
        }
    }

    private sealed class StubProjectProvider(IReadOnlyList<ProjectSnapshot> projects) : IProjectProvider
    {
        public int CallCount { get; private set; }

        public Task<IReadOnlyList<ProjectSnapshot>> GetFeaturedAsync(
            CancellationToken cancellationToken = default)
        {
            CallCount++;
            return Task.FromResult(projects);
        }
    }
}
