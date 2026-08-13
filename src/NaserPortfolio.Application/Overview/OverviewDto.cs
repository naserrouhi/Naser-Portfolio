using System.Text.Json.Serialization;

namespace NaserPortfolio.Application.Overview;

public sealed record OverviewDto(
    ProfileDto Profile,
    [property: JsonPropertyName("githubRepositories")]
    IReadOnlyList<ProjectDto> GitHubRepositories);

public sealed record ProfileDto(
    string Name,
    string Headline,
    string Summary,
    string Location,
    string Email,
    string Phone,
    int YearsOfExperience,
    bool OpenToRelocation,
    string AvatarUrl,
    string ResumeUrl,
    IReadOnlyList<SocialLinkDto> SocialLinks,
    IReadOnlyList<ExperienceDto> Experience,
    EducationDto Education,
    IReadOnlyList<AwardDto> Awards,
    IReadOnlyList<SkillGroupDto> SkillGroups,
    IReadOnlyList<SpokenLanguageDto> Languages,
    IReadOnlyList<ImpactMetricDto> Impact,
    IReadOnlyList<CaseStudyDto> KeyProjects);

public sealed record SocialLinkDto(string Platform, string Url);

public sealed record ExperienceDto(
    string Company,
    string Role,
    string Location,
    string StartDate,
    string? EndDate,
    string Summary,
    IReadOnlyList<string> Highlights,
    IReadOnlyList<string> Technologies);

public sealed record EducationDto(
    string Institution,
    string Degree,
    string Field,
    string Location,
    string StartYear,
    string EndYear,
    string Description);

public sealed record AwardDto(
    string Title,
    string Issuer,
    string Date);

public sealed record SkillGroupDto(string Name, IReadOnlyList<string> Skills);

public sealed record SpokenLanguageDto(string Name, string Proficiency);

public sealed record ImpactMetricDto(string Value, string Label, string Context);

public sealed record CaseStudyDto(
    string Slug,
    string Name,
    string Description,
    string Role,
    string Period,
    IReadOnlyList<string> Technologies,
    string? ExternalUrl);

public sealed record ProjectDto(
    string Slug,
    string Name,
    string Summary,
    string RepositoryUrl,
    string? LiveUrl,
    string PrimaryLanguage,
    IReadOnlyList<string> Technologies,
    int? Stars,
    DateTimeOffset? LastPushedAtUtc,
    bool IsFeatured,
    string Evidence);
