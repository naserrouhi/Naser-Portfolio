using NaserPortfolio.Application.Profiles;
using NaserPortfolio.Infrastructure.Profiles;

namespace NaserPortfolio.Infrastructure.Tests.Profiles;

public sealed class ResumeProfileProviderTests
{
    [Fact]
    public async Task GetAsync_Returns_complete_resume_timeline_and_contact_details()
    {
        var provider = new ResumeProfileProvider();

        var profile = await provider.GetAsync(CancellationToken.None);

        Assert.Equal("naserrouhi.nomonia@gmail.com", profile.Email);
        Assert.Equal("+98 912 806 1286", profile.Phone);
        Assert.Collection(
            profile.Experience,
            static item => AssertExperience(item, "Frontline Data Solutions", "2025-09", null, 4),
            static item => AssertExperience(item, "Alibaba Travels Co.", "2024-03", "2025-08", 3),
            static item => AssertExperience(item, "Porter Airlines · Car Media · FreightNav", "2020-07", "2025-02", 4),
            static item => AssertExperience(item, "Asa Co. (Agah Broker)", "2021-07", "2024-02", 4),
            static item => AssertExperience(item, "Geeks Ltd", "2020-07", "2021-06", 3),
            static item => AssertExperience(item, "MyDigipay (Digikala Group)", "2017-10", "2020-06", 4));
    }

    [Fact]
    public async Task GetAsync_Preserves_measurable_experience_descriptions_from_resume()
    {
        var provider = new ResumeProfileProvider();

        var profile = await provider.GetAsync(CancellationToken.None);

        Assert.Contains(
            "Built observability tooling with the ELK stack, cutting average issue resolution time by over 40%.",
            profile.Experience[0].Highlights);
        Assert.Contains(
            "Helped grow the user base by over 50% and increase company revenue by 40% after launch.",
            profile.Experience[1].Highlights);
        Assert.Contains(
            "Built scalable microservices and APIs for Car Media, reaching 99.9% data synchronization and boosting vehicle-search speed by 80% with Elasticsearch.",
            profile.Experience[2].Highlights);
        Assert.Contains(
            "Built REST APIs and admin panels that supported a 30 to 40% increase in user engagement after launch.",
            profile.Experience[3].Highlights);
    }

    [Fact]
    public async Task GetAsync_Preserves_education_award_and_language_priority_from_resume()
    {
        var provider = new ResumeProfileProvider();

        var profile = await provider.GetAsync(CancellationToken.None);

        Assert.Equal("Shahid Beheshti University", profile.Education.Institution);
        Assert.Equal("B.Sc.", profile.Education.Degree);
        Assert.Equal("Civil Engineering", profile.Education.Field);
        Assert.Equal("Tehran, Iran", profile.Education.Location);
        Assert.Equal("2013", profile.Education.StartYear);
        Assert.Equal("2017", profile.Education.EndYear);
        Assert.Equal(
            "Found a passion for software during academic programming courses, which led to a full career transition into tech.",
            profile.Education.Description);

        var award = Assert.Single(profile.Awards);
        Assert.Equal("4th Place, Regional Mathematics Olympiad", award.Title);
        Assert.Equal("District 20, Tehran", award.Issuer);
        Assert.Equal("2006 & 2007", award.Date);

        Assert.Collection(
            profile.Languages,
            static language =>
            {
                Assert.Equal("English", language.Name);
                Assert.Equal("Professional Working Proficiency", language.Proficiency);
            },
            static language =>
            {
                Assert.Equal("Persian", language.Name);
                Assert.Equal("Native", language.Proficiency);
            });
    }

    [Fact]
    public async Task GetAsync_Uses_the_exact_resume_skill_categories()
    {
        var provider = new ResumeProfileProvider();

        var profile = await provider.GetAsync(CancellationToken.None);

        Assert.Collection(
            profile.SkillGroups,
            static group => AssertSkillGroup(group, "Languages", "C#", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"),
            static group => AssertSkillGroup(group, "Back-End", ".NET / ASP.NET Core", "Entity Framework Core", "LINQ", "REST APIs", "SignalR", "Blazor", "ELSA Workflow"),
            static group => AssertSkillGroup(group, "Front-End", "ReactJS", "Razor", "jQuery"),
            static group => AssertSkillGroup(group, "Architecture & Design", "Clean Architecture", "Microservices", "CQRS", "DDD", "SOLID", "Design Patterns", "OOP"),
            static group => AssertSkillGroup(group, "Data & Messaging", "SQL Server", "PostgreSQL", "MongoDB", "Oracle", "Elasticsearch", "Redis", "RabbitMQ", "Kafka"),
            static group => AssertSkillGroup(group, "DevOps & Cloud", "Docker", "CI/CD", "Git", "Azure", "AWS", "ELK Stack"),
            static group => AssertSkillGroup(group, "Practices", "TDD", "BDD", "Unit & Integration Testing", "AI-assisted development", "custom AI skill / tool authoring"));
    }

    [Fact]
    public async Task GetAsync_Keeps_all_resume_projects_separate_from_repository_data()
    {
        var provider = new ResumeProfileProvider();

        var profile = await provider.GetAsync(CancellationToken.None);

        Assert.Collection(
            profile.KeyProjects,
            static project => AssertProject(
                project,
                "ehs-suite",
                "EHS Suite — Environmental, Health & Safety Management",
                "Sep 2025 – Present",
                "Compliance platform for industrial clients: MOC, ACT and LMS modules with an offline-capable mobile app.",
                ".NET", "Redis", "ELK"),
            static project => AssertProject(
                project,
                "arobus",
                "Arobus — B2C Bus Ticketing",
                "Mar 2024 – Aug 2025",
                "Consumer platform selling tickets direct from providers, with an integrated back-office.",
                "Microservices", "DDD"),
            static project => AssertProject(
                project,
                "rebook-pump",
                "Rebook Pump — Airline Rebooking & Fuel Management",
                "Jul 2020 – Feb 2025",
                "Modernized rebooking and fuel-pricing platforms with workflow automation.",
                ".NET", "RabbitMQ", "ELK"),
            static project => AssertProject(
                project,
                "bookkeeping-platform",
                "Bookkeeping Platform",
                "Jun 2022 – Feb 2024",
                "Multi-company financial reporting rebuilt from legacy: new schema, query optimization, large datasets.",
                "CQRS", "Redis"),
            static project => AssertProject(
                project,
                "agah-lms",
                "Agah LMS — Financial Training Platform",
                "Jul 2021 – May 2022",
                "Back-end and admin panel for a brokerage's learning platform: courses, tracking, reporting.",
                "DDD", "TDD"));
    }

    private static void AssertExperience(
        ExperienceSnapshot experience,
        string company,
        string startDate,
        string? endDate,
        int highlightCount)
    {
        Assert.Equal(company, experience.Company);
        Assert.Equal(startDate, experience.StartDate);
        Assert.Equal(endDate, experience.EndDate);
        Assert.False(string.IsNullOrWhiteSpace(experience.Summary));
        Assert.Equal(highlightCount, experience.Highlights.Count);
    }

    private static void AssertSkillGroup(
        SkillGroupSnapshot group,
        string expectedName,
        params string[] expectedSkills)
    {
        Assert.Equal(expectedName, group.Name);
        Assert.Equal(expectedSkills, group.Skills);
    }

    private static void AssertProject(
        CaseStudySnapshot project,
        string expectedSlug,
        string expectedName,
        string expectedPeriod,
        string expectedDescription,
        params string[] expectedTechnologies)
    {
        Assert.Equal(expectedSlug, project.Slug);
        Assert.Equal(expectedName, project.Name);
        Assert.Equal(expectedPeriod, project.Period);
        Assert.Equal(expectedDescription, project.Description);
        Assert.Equal(expectedTechnologies, project.Technologies);
    }
}
