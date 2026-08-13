namespace NaserPortfolio.Application.Profiles;

public sealed record ProfileSnapshot(
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
    IReadOnlyList<SocialLinkSnapshot> SocialLinks,
    IReadOnlyList<ExperienceSnapshot> Experience,
    EducationSnapshot Education,
    IReadOnlyList<AwardSnapshot> Awards,
    IReadOnlyList<SkillGroupSnapshot> SkillGroups,
    IReadOnlyList<SpokenLanguageSnapshot> Languages,
    IReadOnlyList<ImpactMetricSnapshot> Impact,
    IReadOnlyList<CaseStudySnapshot> KeyProjects);

public sealed record SocialLinkSnapshot(string Platform, string Url);

public sealed record ExperienceSnapshot(
    string Company,
    string Role,
    string Location,
    string StartDate,
    string? EndDate,
    string Summary,
    IReadOnlyList<string> Highlights,
    IReadOnlyList<string> Technologies);

public sealed record EducationSnapshot(
    string Institution,
    string Degree,
    string Field,
    string Location,
    string StartYear,
    string EndYear,
    string Description);

public sealed record AwardSnapshot(
    string Title,
    string Issuer,
    string Date);

public sealed record SkillGroupSnapshot(string Name, IReadOnlyList<string> Skills);

public sealed record SpokenLanguageSnapshot(string Name, string Proficiency);

public sealed record ImpactMetricSnapshot(string Value, string Label, string Context);

public sealed record CaseStudySnapshot(
    string Slug,
    string Name,
    string Description,
    string Role,
    string Period,
    IReadOnlyList<string> Technologies,
    string? ExternalUrl);
