using NaserPortfolio.Application.Profiles;
using NaserPortfolio.Application.Projects;

namespace NaserPortfolio.Application.Overview;

public sealed class GetPortfolioOverviewQueryHandler(
    IProfileProvider profileProvider,
    IProjectProvider projectProvider)
{
    public async Task<OverviewDto> HandleAsync(CancellationToken cancellationToken = default)
    {
        var profileTask = profileProvider.GetAsync(cancellationToken);
        var projectsTask = projectProvider.GetFeaturedAsync(cancellationToken);

        await Task.WhenAll(profileTask, projectsTask);

        return new OverviewDto(
            MapProfile(await profileTask),
            (await projectsTask).Select(MapProject).ToArray());
    }

    private static ProfileDto MapProfile(ProfileSnapshot profile) =>
        new(
            profile.Name,
            profile.Headline,
            profile.Summary,
            profile.Location,
            profile.Email,
            profile.Phone,
            profile.YearsOfExperience,
            profile.OpenToRelocation,
            profile.AvatarUrl,
            profile.ResumeUrl,
            profile.SocialLinks.Select(static link => new SocialLinkDto(link.Platform, link.Url)).ToArray(),
            profile.Experience.Select(static item => new ExperienceDto(
                item.Company,
                item.Role,
                item.Location,
                item.StartDate,
                item.EndDate,
                item.Summary,
                item.Highlights,
                item.Technologies)).ToArray(),
            new EducationDto(
                profile.Education.Institution,
                profile.Education.Degree,
                profile.Education.Field,
                profile.Education.Location,
                profile.Education.StartYear,
                profile.Education.EndYear,
                profile.Education.Description),
            profile.Awards.Select(static award => new AwardDto(
                award.Title,
                award.Issuer,
                award.Date)).ToArray(),
            profile.SkillGroups.Select(static group => new SkillGroupDto(group.Name, group.Skills)).ToArray(),
            profile.Languages.Select(static language => new SpokenLanguageDto(language.Name, language.Proficiency)).ToArray(),
            profile.Impact.Select(static metric => new ImpactMetricDto(metric.Value, metric.Label, metric.Context)).ToArray(),
            profile.KeyProjects.Select(static work => new CaseStudyDto(
                work.Slug,
                work.Name,
                work.Description,
                work.Role,
                work.Period,
                work.Technologies,
                work.ExternalUrl)).ToArray());

    private static ProjectDto MapProject(ProjectSnapshot project) =>
        new(
            project.Slug,
            project.Name,
            project.Summary,
            project.RepositoryUrl,
            project.LiveUrl,
            project.PrimaryLanguage,
            project.Technologies,
            project.Stars,
            project.LastPushedAtUtc,
            project.IsFeatured,
            project.Evidence);
}
