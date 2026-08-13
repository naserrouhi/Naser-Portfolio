import { portfolioWorkbenchPublication } from "@/lib/article-routes";

export type ProfessionalMetric = {
  value: string;
  label: string;
  context?: string;
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end?: string;
  employmentType?: "Full-time" | "Part-time";
  location?: string;
  summary?: string;
  highlights?: readonly string[];
  technologies?: readonly string[];
};

export type Project = {
  kind: "resume-project" | "github-repository";
  slug: string;
  name: string;
  description: string;
  stack: readonly string[];
  repositoryUrl?: string;
  websiteUrl?: string;
  featured?: boolean;
  note?: string;
};

export type SkillGroup = {
  name: string;
  items: readonly string[];
};

export type Education = {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  location: string;
  note: string;
};

export type SpokenLanguage = {
  name: string;
  proficiency: string;
};

export type Award = {
  title: string;
  organization: string;
  years: readonly string[];
};

export type ArticleSection = {
  heading: string;
  paragraphs: readonly string[];
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  language: string;
  availableLanguages?: readonly string[];
  status: "case-study" | "planned";
  publishedAt?: string;
  readingMinutes?: number;
  sections?: readonly ArticleSection[];
};

export type PortfolioOverview = {
  profile: {
    name: string;
    headline: string;
    summary: string;
    location: string;
    email: string;
    phone?: string;
    yearsOfExperience: string;
    github: {
      handle: string;
      url: string;
      bio: string;
      company: string;
      publicRepositories: number;
      receivedStars: number;
      snapshotDate: string;
    };
    linkedinUrl: string;
    education: Education;
    languages: readonly SpokenLanguage[];
    awards: readonly Award[];
  };
  metrics: readonly ProfessionalMetric[];
  experience: readonly Experience[];
  keyProjects: readonly Project[];
  githubRepositories: readonly Project[];
  skills: readonly SkillGroup[];
  articles: readonly Article[];
};

export const portfolioWorkbenchArticle: Article = {
  slug: portfolioWorkbenchPublication.slug,
  title: "Portfolio Workbench: building a faithful Visual Studio experience",
  excerpt:
    "A transparent case study of this 2026 portfolio build: turning familiar developer-workbench patterns into an accessible, localized, SEO-friendly product.",
  language: "en",
  availableLanguages: portfolioWorkbenchPublication.locales,
  status: "case-study",
  publishedAt: portfolioWorkbenchPublication.publishedAt,
  readingMinutes: 6,
  sections: [
    {
      heading: "The design problem",
      paragraphs: [
        "A developer portfolio should feel personal without forcing visitors to learn a novelty interface. Portfolio Workbench recreates the spatial grammar of Visual Studio—C# documents, Solution Explorer, Output, search, and status—while keeping every region semantic and useful.",
        "The high-fidelity shell uses the Visual Studio product mark and familiar tool-window behavior, but every command performs a genuine portfolio action and the content remains accessible web content rather than a screenshot.",
      ],
    },
    {
      heading: "Architecture that serves the page",
      paragraphs: [
        "Next.js server-rendered routes keep each profile section and article addressable. A typed locale dictionary supplies eight interface languages, while the content model remains independent of the shell. The client-side workbench owns only interaction state such as panels, shortcuts, and theme.",
        "A small API boundary reads the .NET portfolio endpoints and falls back to verified local data when the API is unavailable. That makes the site resilient in previews and honest about its source material.",
      ],
    },
    {
      heading: "Accessibility before visual mimicry",
      paragraphs: [
        "The editor surface is still an article, headings remain headings, and navigation remains links. Decorative line numbers are hidden from assistive technology. Menus, dialogs, sheets, focus management, skip links, reduced motion, and RTL layouts are treated as product behavior rather than polish.",
        "On mobile, the desktop workbench is reorganized instead of miniaturized: the explorer and output become sheets, core content scrolls normally, and touch targets grow.",
      ],
    },
    {
      heading: "Pragmatic discipline",
      paragraphs: [
        "The project uses clean boundaries where they earn their keep: typed content contracts, resilient transport, server and client component separation, and tests around behavior. The result stays easy to extend when a real CMS or additional backend capability arrives.",
      ],
    },
  ],
};

export const localPortfolio: PortfolioOverview = {
  profile: {
    name: "Naser Rouhi",
    headline: "Senior Software Engineer",
    summary:
      "A pragmatic software engineer with 8+ years of experience building scalable backend and full-stack systems with .NET, distributed architecture, and modern web technologies.",
    location: "Tehran, Iran",
    email: "naserrouhi.nomonia@gmail.com",
    phone: "+98 912 806 1286",
    yearsOfExperience: "8+",
    github: {
      handle: "naserrouhi",
      url: "https://github.com/naserrouhi",
      bio: "Software Engineer ⚡ .NET · Backend · Building things that scale.",
      company: "Frontline Data Solutions",
      publicRepositories: 5,
      receivedStars: 10,
      snapshotDate: "2026-08-08",
    },
    linkedinUrl: "https://www.linkedin.com/in/naser-rouhi-nomonia/",
    education: {
      degree: "B.Sc. in Civil Engineering",
      institution: "Shahid Beheshti University",
      startYear: "2013",
      endYear: "2017",
      location: "Tehran, Iran",
      note: "Found a passion for software during academic programming courses, which led to a full career transition into tech.",
    },
    languages: [
      { name: "English", proficiency: "Professional Working Proficiency" },
      { name: "Persian", proficiency: "Native" },
    ],
    awards: [
      {
        title: "4th Place, Regional Mathematics Olympiad",
        organization: "District 20, Tehran",
        years: ["2006", "2007"],
      },
    ],
  },
  metrics: [
    { value: "70%", label: "faster reporting and query workflows" },
    { value: "80%", label: "faster vehicle search" },
    { value: "99.9%", label: "synchronization reliability" },
    { value: "40%", label: "revenue growth contribution" },
  ],
  experience: [
    {
      company: "Frontline Data Solutions",
      role: "Back-End Developer",
      start: "2025-09-01",
      location: "Texas, USA (Remote)",
      employmentType: "Full-time",
      summary: "Modernizing EHS Suite modules while improving scalability, reliability, offline access, and operational visibility.",
      highlights: [
        "Rewrote a legacy system into a modular REST API architecture for EHS Suite modules (MOC, ACT, LMS), improving scalability and reliability while accelerating development velocity and customer satisfaction.",
        "Designed and optimized high-performance queries and caching layers to support offline sync for the mobile app, ensuring fast, reliable data access under intermittent connectivity.",
        "Built observability tooling with the ELK stack, cutting average issue resolution time by over 40%.",
        "Collaborated with globally distributed teams to keep data integration secure and efficient across modules.",
      ],
      technologies: [".NET", "REST APIs", "SQL Server", "Redis", "ELK", "Offline Sync"],
    },
    {
      company: "Alibaba Travels Co.",
      role: "Senior Software Engineer",
      start: "2024-03-01",
      end: "2025-08-31",
      location: "Tehran, Iran",
      employmentType: "Full-time",
      summary: "Developed and architected Arobus, a B2C bus-ticketing platform with integrated back-office operations.",
      highlights: [
        "Developed Arobus (arobus.ir), a B2C bus-ticketing platform with an integrated back-office system, enabling end-to-end ticket sales and operational management.",
        "Architected the platform on microservices and DDD, keeping domain boundaries clean and maintainable.",
        "Helped grow the user base by over 50% and increase company revenue by 40% after launch.",
      ],
      technologies: [".NET", "Microservices", "DDD", "B2C", "Ticketing"],
    },
    {
      company: "Porter Airlines · Car Media · FreightNav",
      role: "Full-Stack / Back-End Developer",
      start: "2020-07-01",
      end: "2025-02-28",
      location: "Ontario, Canada (Remote)",
      employmentType: "Part-time",
      summary: "Delivered part-time backend and full-stack improvements across aviation, automotive data, and logistics products.",
      highlights: [
        "Improved Porter Airlines' fuel-pricing and rebooking platforms, cutting query time by 70% and automating manual workflows to reduce processing time by 60%.",
        "Built scalable microservices and APIs for Car Media, reaching 99.9% data synchronization and boosting vehicle-search speed by 80% with Elasticsearch.",
        "Delivered real-time communication and shipment-tracking modules at FreightNav using SignalR and Blazor, improving coordination between shippers and carriers.",
        "Strengthened reliability with RabbitMQ and ELK observability, applying Clean Architecture and TDD across all three codebases.",
      ],
      technologies: [".NET", "Elasticsearch", "RabbitMQ", "SignalR", "Blazor", "ELK", "TDD"],
    },
    {
      company: "Asa Co. (Agah Broker)",
      role: "Back-End Developer",
      start: "2021-07-01",
      end: "2024-02-29",
      location: "Tehran, Iran",
      employmentType: "Full-time",
      summary: "Modernized bookkeeping, financial reporting, and learning-management systems for a brokerage environment.",
      highlights: [
        "Rebuilt legacy bookkeeping and LMS systems, redesigning the database schema to handle large-scale financial reporting with better performance.",
        "Applied Clean Architecture, CQRS, and DDD for maintainable, modular codebases.",
        "Built REST APIs and admin panels that supported a 30 to 40% increase in user engagement after launch.",
        "Worked closely with cross-functional teams to improve data consistency and business-process automation.",
      ],
      technologies: [".NET", "CQRS", "DDD", "Clean Architecture", "Redis", "SQL Server"],
    },
    {
      company: "Geeks Ltd",
      role: "Full-Stack / Back-End Developer",
      start: "2020-07-01",
      end: "2021-06-30",
      location: "London, UK (Remote)",
      employmentType: "Full-time",
      summary: "Built patient-management and workflow-automation systems for healthcare operations.",
      highlights: [
        "Built patient-management and workflow-automation systems using ELSA Workflow and .NET Core.",
        "Implemented testing and orchestration modules that improved reliability and reduced deployment issues.",
        "Contributed frontend modules with Razor and jQuery to streamline internal processes.",
      ],
      technologies: [".NET Core", "ELSA Workflow", "Razor", "jQuery", "Healthcare"],
    },
    {
      company: "MyDigipay (Digikala Group)",
      role: "Full-Stack / Back-End Developer",
      start: "2017-10-01",
      end: "2020-06-30",
      location: "Tehran, Iran",
      employmentType: "Full-time",
      summary: "Developed core financial systems, reporting services, and internal platforms for a digital-commerce ecosystem.",
      highlights: [
        "Developed core financial systems, improving processing speed and data accuracy across several products.",
        "Optimized SQL queries and restructured legacy code, reducing production error reports and API response times.",
        "Built centralized reporting services integrating SQL Server, MongoDB, and Oracle for real-time analytics.",
        "Collaborated with business teams to digitize internal tools, increasing operational efficiency and customer acquisition.",
      ],
      technologies: ["C#", ".NET", "SQL Server", "MongoDB", "Oracle", "Financial Systems"],
    },
  ],
  keyProjects: [
    {
      kind: "resume-project",
      slug: "ehs-suite",
      name: "EHS Suite — Environmental, Health & Safety Management",
      description:
        "Compliance platform for industrial clients: MOC, ACT and LMS modules with an offline-capable mobile app.",
      stack: [".NET", "Redis", "ELK"],
      websiteUrl: "https://ehsqa1.fldata.com/",
      featured: true,
      note: "Sep 2025 — Present",
    },
    {
      kind: "resume-project",
      slug: "arobus",
      name: "Arobus — B2C Bus Ticketing",
      description:
        "Consumer platform selling tickets direct from providers, with an integrated back-office.",
      stack: ["Microservices", "DDD"],
      websiteUrl: "https://www.arobus.ir/",
      featured: true,
      note: "Mar 2024 — Aug 2025",
    },
    {
      kind: "resume-project",
      slug: "rebook-pump",
      name: "Rebook Pump — Airline Rebooking & Fuel Management",
      description:
        "Modernized rebooking and fuel-pricing platforms with workflow automation.",
      stack: [".NET", "RabbitMQ", "ELK"],
      note: "Jul 2020 — Feb 2025",
    },
    {
      kind: "resume-project",
      slug: "bookkeeping-platform",
      name: "Bookkeeping Platform",
      description:
        "Multi-company financial reporting rebuilt from legacy: new schema, query optimization, large datasets.",
      stack: ["CQRS", "Redis"],
      note: "Jun 2022 — Feb 2024",
    },
    {
      kind: "resume-project",
      slug: "agah-lms",
      name: "Agah LMS — Financial Training Platform",
      description:
        "Back-end and admin panel for a brokerage's learning platform: courses, tracking, reporting.",
      stack: ["DDD", "TDD"],
      websiteUrl: "https://academy.agah.com/",
      note: "Jul 2021 — May 2022",
    },
  ],
  githubRepositories: [
    {
      kind: "github-repository",
      slug: "daveslist",
      name: "Daveslist",
      description:
        "A DDD-oriented .NET 8 classifieds API separated into API, Application, Domain, Infrastructure, and test projects.",
      stack: [".NET 8", "DDD", "EF Core", "SQL Server", "Identity", "xUnit"],
      repositoryUrl: "https://github.com/naserrouhi/Daveslist",
    },
    {
      kind: "github-repository",
      slug: "code-contest-hub",
      name: "CodeContestHub",
      description:
        "Codewars and HackerRank algorithms plus object-oriented exercises, with 27 solution-and-test pairs across 68 commits.",
      stack: ["C#", "Algorithms", "OOP", "Tests"],
      repositoryUrl: "https://github.com/naserrouhi/CodeContestHub",
    },
    {
      kind: "github-repository",
      slug: "resume",
      name: "Resume",
      description:
        "JSON Resume data and its automated workflow—the structured source behind the public résumé.",
      stack: ["JSON Resume", "Automation"],
      repositoryUrl: "https://github.com/naserrouhi/Resume",
    },
    {
      kind: "github-repository",
      slug: "code-mastery-qa",
      name: "CodeMastery-QA",
      description:
        "A curated learning and Q&A archive containing 279 Markdown files focused on .NET and JavaScript notes.",
      stack: [".NET", "JavaScript", "Learning notes"],
      repositoryUrl: "https://github.com/naserrouhi/CodeMastery-QA",
      note: "Curated learning material; not presented as an authored publication archive.",
    },
  ],
  skills: [
    { name: "Languages", items: ["C#", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"] },
    {
      name: "Back-End",
      items: [".NET / ASP.NET Core", "Entity Framework Core", "LINQ", "REST APIs", "SignalR", "Blazor", "ELSA Workflow"],
    },
    {
      name: "Front-End",
      items: ["ReactJS", "Razor", "jQuery"],
    },
    {
      name: "Architecture & Design",
      items: ["Clean Architecture", "Microservices", "CQRS", "DDD", "SOLID", "Design Patterns", "OOP"],
    },
    {
      name: "Data & Messaging",
      items: ["SQL Server", "PostgreSQL", "MongoDB", "Oracle", "Elasticsearch", "Redis", "RabbitMQ", "Kafka"],
    },
    {
      name: "DevOps & Cloud",
      items: ["Docker", "CI/CD", "Git", "Azure", "AWS", "ELK Stack"],
    },
    {
      name: "Practices",
      items: ["TDD", "BDD", "Unit & Integration Testing", "AI-assisted development", "custom AI skill / tool authoring"],
    },
  ],
  articles: [
    portfolioWorkbenchArticle,
    {
      slug: "aggregate-boundaries-in-practice",
      title: "Aggregate boundaries in practice",
      excerpt: "A planned field note on finding useful consistency boundaries without adding ceremony.",
      language: "en",
      status: "planned",
    },
    {
      slug: "resilient-dotnet-integrations",
      title: "Resilient .NET integrations",
      excerpt: "A planned field note on timeouts, idempotency, observability, and failure-aware contracts.",
      language: "en",
      status: "planned",
    },
  ],
};
