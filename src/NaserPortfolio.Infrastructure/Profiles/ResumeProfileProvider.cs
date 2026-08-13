using NaserPortfolio.Application.Profiles;

namespace NaserPortfolio.Infrastructure.Profiles;

public sealed class ResumeProfileProvider : IProfileProvider
{
    private static readonly ProfileSnapshot Profile = new(
        Name: "Naser Rouhi",
        Headline: "Senior Software Engineer · .NET · Backend · Distributed Systems",
        Summary: "Senior Software Engineer with 8+ years building and scaling web applications in .NET, C#, and ReactJS. Focused on Clean Architecture, microservices, CQRS, DDD, test-driven development, database optimization, and high-throughput APIs across finance, aviation, healthcare, transportation, and EHS products.",
        Location: "Tehran, Iran",
        Email: "naserrouhi.nomonia@gmail.com",
        Phone: "+98 912 806 1286",
        YearsOfExperience: 8,
        OpenToRelocation: true,
        AvatarUrl: "https://avatars.githubusercontent.com/u/85635566?v=4",
        ResumeUrl: "https://github.com/naserrouhi/Resume/blob/main/resume.json",
        SocialLinks:
        [
            new("GitHub", "https://github.com/naserrouhi"),
            new("LinkedIn", "https://www.linkedin.com/in/naser-rouhi-nomonia/")
        ],
        Experience:
        [
            new(
                "Frontline Data Solutions",
                "Back-End Developer",
                "Texas, USA (Remote)",
                "2025-09",
                null,
                "Modernizing EHS Suite modules while improving scalability, reliability, offline access, and operational visibility.",
                [
                    "Rewrote a legacy system into a modular REST API architecture for EHS Suite modules (MOC, ACT, LMS), improving scalability and reliability while accelerating development velocity and customer satisfaction.",
                    "Designed and optimized high-performance queries and caching layers to support offline sync for the mobile app, ensuring fast, reliable data access under intermittent connectivity.",
                    "Built observability tooling with the ELK stack, cutting average issue resolution time by over 40%.",
                    "Collaborated with globally distributed teams to keep data integration secure and efficient across modules."
                ],
                [".NET", "REST APIs", "SQL Server", "Redis", "ELK", "Offline Sync"]),
            new(
                "Alibaba Travels Co.",
                "Senior Software Engineer",
                "Tehran, Iran",
                "2024-03",
                "2025-08",
                "Developed and architected Arobus, a B2C bus-ticketing platform with integrated back-office operations.",
                [
                    "Developed Arobus (arobus.ir), a B2C bus-ticketing platform with an integrated back-office system, enabling end-to-end ticket sales and operational management.",
                    "Architected the platform on microservices and DDD, keeping domain boundaries clean and maintainable.",
                    "Helped grow the user base by over 50% and increase company revenue by 40% after launch."
                ],
                [".NET", "Microservices", "DDD", "B2C", "Ticketing"]),
            new(
                "Porter Airlines · Car Media · FreightNav",
                "Full-Stack / Back-End Developer (Part-time)",
                "Ontario, Canada (Remote)",
                "2020-07",
                "2025-02",
                "Delivered part-time backend and full-stack improvements across aviation, automotive data, and logistics products.",
                [
                    "Improved Porter Airlines' fuel-pricing and rebooking platforms, cutting query time by 70% and automating manual workflows to reduce processing time by 60%.",
                    "Built scalable microservices and APIs for Car Media, reaching 99.9% data synchronization and boosting vehicle-search speed by 80% with Elasticsearch.",
                    "Delivered real-time communication and shipment-tracking modules at FreightNav using SignalR and Blazor, improving coordination between shippers and carriers.",
                    "Strengthened reliability with RabbitMQ and ELK observability, applying Clean Architecture and TDD across all three codebases."
                ],
                [".NET", "Elasticsearch", "RabbitMQ", "SignalR", "Blazor", "ELK", "TDD"]),
            new(
                "Asa Co. (Agah Broker)",
                "Back-End Developer",
                "Tehran, Iran",
                "2021-07",
                "2024-02",
                "Modernized bookkeeping, financial reporting, and learning-management systems for a brokerage environment.",
                [
                    "Rebuilt legacy bookkeeping and LMS systems, redesigning the database schema to handle large-scale financial reporting with better performance.",
                    "Applied Clean Architecture, CQRS, and DDD for maintainable, modular codebases.",
                    "Built REST APIs and admin panels that supported a 30 to 40% increase in user engagement after launch.",
                    "Worked closely with cross-functional teams to improve data consistency and business-process automation."
                ],
                [".NET", "CQRS", "DDD", "Clean Architecture", "Redis", "SQL Server"]),
            new(
                "Geeks Ltd",
                "Full-Stack / Back-End Developer",
                "London, UK (Remote)",
                "2020-07",
                "2021-06",
                "Built patient-management and workflow-automation systems for healthcare operations.",
                [
                    "Built patient-management and workflow-automation systems using ELSA Workflow and .NET Core.",
                    "Implemented testing and orchestration modules that improved reliability and reduced deployment issues.",
                    "Contributed frontend modules with Razor and jQuery to streamline internal processes."
                ],
                [".NET Core", "ELSA Workflow", "Razor", "jQuery", "Healthcare"]),
            new(
                "MyDigipay (Digikala Group)",
                "Full-Stack / Back-End Developer",
                "Tehran, Iran",
                "2017-10",
                "2020-06",
                "Developed core financial systems, reporting services, and internal platforms for a digital-commerce ecosystem.",
                [
                    "Developed core financial systems, improving processing speed and data accuracy across several products.",
                    "Optimized SQL queries and restructured legacy code, reducing production error reports and API response times.",
                    "Built centralized reporting services integrating SQL Server, MongoDB, and Oracle for real-time analytics.",
                    "Collaborated with business teams to digitize internal tools, increasing operational efficiency and customer acquisition."
                ],
                ["C#", ".NET", "SQL Server", "MongoDB", "Oracle", "Financial Systems"])
        ],
        Education: new(
            "Shahid Beheshti University",
            "B.Sc.",
            "Civil Engineering",
            "Tehran, Iran",
            "2013",
            "2017",
            "Found a passion for software during academic programming courses, which led to a full career transition into tech."),
        Awards:
        [
            new(
                "4th Place, Regional Mathematics Olympiad",
                "District 20, Tehran",
                "2006 & 2007")
        ],
        SkillGroups:
        [
            new("Languages", ["C#", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"]),
            new("Back-End", [".NET / ASP.NET Core", "Entity Framework Core", "LINQ", "REST APIs", "SignalR", "Blazor", "ELSA Workflow"]),
            new("Front-End", ["ReactJS", "Razor", "jQuery"]),
            new("Architecture & Design", ["Clean Architecture", "Microservices", "CQRS", "DDD", "SOLID", "Design Patterns", "OOP"]),
            new("Data & Messaging", ["SQL Server", "PostgreSQL", "MongoDB", "Oracle", "Elasticsearch", "Redis", "RabbitMQ", "Kafka"]),
            new("DevOps & Cloud", ["Docker", "CI/CD", "Git", "Azure", "AWS", "ELK Stack"]),
            new("Practices", ["TDD", "BDD", "Unit & Integration Testing", "AI-assisted development", "custom AI skill / tool authoring"])
        ],
        Languages:
        [
            new("English", "Professional Working Proficiency"),
            new("Persian", "Native")
        ],
        Impact:
        [
            new("70%", "faster reporting", "Self-reported résumé result from query and reporting optimization."),
            new("80%", "faster vehicle search", "Self-reported résumé result from Elasticsearch-backed search."),
            new("99.9%", "data synchronization", "Self-reported résumé result from automotive data services."),
            new("40%", "revenue growth", "Self-reported résumé result following the Arobus product launch."),
            new("40%+", "faster issue resolution", "Self-reported résumé result from ELK observability.")
        ],
        KeyProjects:
        [
            new(
                "ehs-suite",
                "EHS Suite — Environmental, Health & Safety Management",
                "Compliance platform for industrial clients: MOC, ACT and LMS modules with an offline-capable mobile app.",
                "Back-End Developer",
                "Sep 2025 – Present",
                [".NET", "Redis", "ELK"],
                "https://ehsqa1.fldata.com/"),
            new(
                "arobus",
                "Arobus — B2C Bus Ticketing",
                "Consumer platform selling tickets direct from providers, with an integrated back-office.",
                "Senior Software Engineer",
                "Mar 2024 – Aug 2025",
                ["Microservices", "DDD"],
                "https://www.arobus.ir/"),
            new(
                "rebook-pump",
                "Rebook Pump — Airline Rebooking & Fuel Management",
                "Modernized rebooking and fuel-pricing platforms with workflow automation.",
                "Full-Stack / Back-End Developer (Part-time)",
                "Jul 2020 – Feb 2025",
                [".NET", "RabbitMQ", "ELK"],
                null),
            new(
                "bookkeeping-platform",
                "Bookkeeping Platform",
                "Multi-company financial reporting rebuilt from legacy: new schema, query optimization, large datasets.",
                "Back-End Developer",
                "Jun 2022 – Feb 2024",
                ["CQRS", "Redis"],
                null),
            new(
                "agah-lms",
                "Agah LMS — Financial Training Platform",
                "Back-end and admin panel for a brokerage's learning platform: courses, tracking, reporting.",
                "Back-End Developer",
                "Jul 2021 – May 2022",
                ["DDD", "TDD"],
                "https://academy.agah.com/")
        ]);

    public Task<ProfileSnapshot> GetAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(Profile);
    }
}
