import type { Locale } from "@/lib/i18n";
import type { PageKey } from "@/lib/navigation";

type PageCopy = {
  title: string;
  summary: string;
};

export type Dictionary = {
  nav: Record<PageKey, string>;
  pages: Record<PageKey, PageCopy>;
  shell: {
    workbench: string;
    search: string;
    searchPlaceholder: string;
    explorer: string;
    output: string;
    timeline: string;
    file: string;
    edit: string;
    view: string;
    navigate: string;
    git: string;
    run: string;
    tools: string;
    help: string;
    ready: string;
    runTour: string;
    openResume: string;
    downloadResume: string;
    print: string;
    copyEmail: string;
    commandPalette: string;
    toggleExplorer: string;
    toggleOutput: string;
    changeTheme: string;
    changeLanguage: string;
    shortcuts: string;
    close: string;
    back: string;
    forward: string;
    openMenu: string;
    filterExplorer: string;
    externalLink: string;
  };
  common: {
    partTime: string;
    fullTime: string;
    featured: string;
    repository: string;
    liveSite: string;
    caseStudy: string;
    planned: string;
    englishContent: string;
    readTime: string;
    professionalOutcomes: string;
    outcomesNote: string;
    selectedWork: string;
    present: string;
    copy: string;
    copied: string;
    spokenLanguages: string;
    education: string;
    awards: string;
    professionalProjects: string;
    githubRepositories: string;
    snapshot: string;
    viewDetails: string;
  };
  content: {
    aboutDelivery: string;
    engineeringApproach: string;
    principles: readonly { title: string; description: string }[];
    olympiad: string;
    publicationNoteTitle: string;
    publicationNoteBody: string;
    publishingSoon: string;
    engineeringPractices: string;
    passed: string;
    snapshotVolatile: string;
    contactHeading: string;
    contactBody: string;
    emailNaser: string;
    coverLetter: string;
    portraitAlt: string;
    noMatchingCommand: string;
    skipToContent: string;
    canonicalEnglishNote: string;
    tourStarted: string;
    years: string;
  };
};

const en: Dictionary = {
  nav: {
    overview: "Overview",
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    articles: "Articles",
    contact: "Contact",
  },
  pages: {
    overview: {
      title: "Engineering systems that scale—and stay understandable.",
      summary:
        "Senior Software Engineer focused on pragmatic .NET architecture, dependable delivery, and measurable product outcomes.",
    },
    about: {
      title: "Architectural discipline, grounded in delivery.",
      summary:
        "I understand the domain first, draw clean boundaries, and use DDD, CQRS, and testing where they create real leverage.",
    },
    experience: {
      title: "Eight years across travel, finance, aviation, and data systems.",
      summary:
        "A chronological view of full-time and explicitly labeled part-time professional work.",
    },
    projects: {
      title: "Selected systems, repositories, and products.",
      summary:
        "Public work that shows domain modeling, test habits, algorithms, learning systems, and practical delivery.",
    },
    skills: {
      title: "Backend depth with full-stack range.",
      summary:
        "A .NET-centered toolkit spanning architecture, data, messaging, frontend engineering, cloud, and testing.",
    },
    articles: {
      title: "Field notes and transparent case studies.",
      summary:
        "One new case study documents this portfolio build. Future topics are clearly marked as planned, not prior publications.",
    },
    contact: {
      title: "Let’s build something dependable.",
      summary:
        "The best ways to start a conversation are email, LinkedIn, or GitHub.",
    },
  },
  shell: {
    workbench: "Portfolio Workbench",
    search: "Search portfolio",
    searchPlaceholder: "Type a page, project, or action…",
    explorer: "Solution Explorer",
    output: "Output",
    timeline: "Timeline",
    file: "File",
    edit: "Edit",
    view: "View",
    navigate: "Navigate",
    git: "Git",
    run: "Run",
    tools: "Tools",
    help: "Help",
    ready: "Ready",
    runTour: "Run portfolio tour",
    openResume: "Open résumé",
    downloadResume: "Download résumé",
    print: "Print résumé",
    copyEmail: "Copy email",
    commandPalette: "Command palette",
    toggleExplorer: "Toggle explorer",
    toggleOutput: "Toggle output",
    changeTheme: "Change theme",
    changeLanguage: "Change language",
    shortcuts: "Keyboard shortcuts",
    close: "Close",
    back: "Back",
    forward: "Forward",
    openMenu: "Open menu",
    filterExplorer: "Filter explorer",
    externalLink: "Opens in a new tab",
  },
  common: {
    partTime: "Part-time",
    fullTime: "Full-time",
    featured: "Featured",
    repository: "Repository",
    liveSite: "Live site",
    caseStudy: "Case study",
    planned: "Planned",
    englishContent: "English content",
    readTime: "min read",
    professionalOutcomes: "Selected professional outcomes",
    outcomesNote: "Self-reported outcomes from the résumé; context varies by engagement.",
    selectedWork: "Selected work",
    present: "Present",
    copy: "Copy",
    copied: "Copied",
    spokenLanguages: "Spoken languages",
    education: "Education",
    awards: "Awards",
    professionalProjects: "Professional Projects",
    githubRepositories: "GitHub repositories",
    snapshot: "GitHub snapshot",
    viewDetails: "View details",
  },
  content: {
    aboutDelivery: "I favor architectural discipline that helps teams deliver: understand the domain, make boundaries explicit, automate the proof, and keep the solution proportionate to the problem.",
    engineeringApproach: "Engineering approach",
    principles: [
      { title: "Domain first", description: "Build a shared language before choosing patterns or boundaries." },
      { title: "Clean boundaries", description: "Separate business decisions from transport, storage, and framework concerns." },
      { title: "Prove behavior", description: "Treat TDD as a habit and BDD as a way to make intent executable." },
      { title: "Deliver pragmatically", description: "Use DDD and CQRS where complexity earns them—not as ceremony." },
    ],
    olympiad: "Two-time regional Mathematics Olympiad participant · 4th place",
    publicationNoteTitle: "Publication note",
    publicationNoteBody: "No prior authored publications were found in the supplied résumé. This section starts with a transparent case study created for this 2026 build; future ideas remain labeled as planned.",
    publishingSoon: "publishing soon",
    engineeringPractices: "Engineering practices",
    passed: "Passed",
    snapshotVolatile: "Counts are a dated, volatile snapshot.",
    contactHeading: "Start with context.",
    contactBody: "Share the problem, the domain, and what a successful outcome looks like. I’m especially interested in .NET backend, distributed systems, architecture, and full-stack product work.",
    emailNaser: "Email Naser",
    coverLetter: "Cover letter",
    portraitAlt: "Portrait of Naser Rouhi",
    noMatchingCommand: "No matching command",
    skipToContent: "Skip to content",
    canonicalEnglishNote: "Professional descriptions below are preserved in their canonical English wording.",
    tourStarted: "Tour started: profile → experience → projects → contact.",
    years: "years",
  },
};

type Translation = Pick<Dictionary, "nav" | "pages" | "shell" | "content" | "common">;

function translated(value: Translation): Dictionary {
  return { ...en, ...value, common: { ...en.common, ...value.common } };
}

const fa = translated({
  nav: { overview: "نمای کلی", about: "درباره من", experience: "تجربه", projects: "پروژه‌ها", skills: "مهارت‌ها", articles: "مقالات", contact: "تماس" },
  pages: {
    overview: { title: "ساخت سامانه‌هایی که مقیاس‌پذیر و قابل‌فهم می‌مانند.", summary: "مهندس ارشد نرم‌افزار با تمرکز بر معماری عمل‌گرای .NET، تحویل مطمئن و نتایج قابل‌اندازه‌گیری." },
    about: { title: "انضباط معماری، همراه با تحویل واقعی.", summary: "ابتدا دامنه را می‌فهمم، مرزهای روشن می‌سازم و DDD، CQRS و تست را جایی به‌کار می‌برم که ارزش ایجاد کنند." },
    experience: { title: "هشت سال تجربه در سفر، مالی، هوانوردی و سامانه‌های داده.", summary: "مروری زمانی بر همکاری‌های تمام‌وقت و پاره‌وقت با برچسب شفاف." },
    projects: { title: "سامانه‌ها، مخزن‌ها و محصولات منتخب.", summary: "نمونه‌های عمومی از مدل‌سازی دامنه، تست، الگوریتم و تحویل عملی." },
    skills: { title: "عمق بک‌اند با گستره فول‌استک.", summary: "ابزارهای .NET محور در معماری، داده، پیام‌رسانی، فرانت‌اند، ابر و تست." },
    articles: { title: "یادداشت‌های فنی و مطالعات موردی شفاف.", summary: "یک مطالعه موردی جدید این نمونه‌کار را مستند می‌کند؛ موضوعات آینده به‌روشنی برنامه‌ریزی‌شده‌اند." },
    contact: { title: "بیایید چیزی قابل‌اعتماد بسازیم.", summary: "ایمیل، لینکدین و گیت‌هاب بهترین راه‌های شروع گفتگو هستند." },
  },
  shell: { ...en.shell, workbench: "میزکار نمونه‌کارها", search: "جست‌وجوی نمونه‌کار", searchPlaceholder: "صفحه، پروژه یا فرمان را بنویسید…", explorer: "کاوشگر راهکار", output: "خروجی", timeline: "خط زمانی", file: "پرونده", edit: "ویرایش", view: "نما", navigate: "پیمایش", run: "اجرا", tools: "ابزارها", help: "راهنما", ready: "آماده", runTour: "اجرای تور نمونه‌کار", openResume: "مشاهده رزومه", downloadResume: "دریافت رزومه", print: "چاپ رزومه", copyEmail: "کپی ایمیل", commandPalette: "پنل فرمان", toggleExplorer: "نمایش کاوشگر", toggleOutput: "نمایش خروجی", changeTheme: "تغییر پوسته", changeLanguage: "تغییر زبان", shortcuts: "میانبرهای صفحه‌کلید", close: "بستن", back: "بازگشت", forward: "جلو", openMenu: "بازکردن منو", filterExplorer: "فیلتر کاوشگر", externalLink: "در زبانه جدید باز می‌شود" },
  common: { partTime: "پاره‌وقت", fullTime: "تمام‌وقت", featured: "ویژه", repository: "مخزن", liveSite: "وب‌سایت", caseStudy: "مطالعه موردی", planned: "برنامه‌ریزی‌شده", englishContent: "محتوای انگلیسی", readTime: "دقیقه مطالعه", professionalOutcomes: "نتایج حرفه‌ای منتخب", outcomesNote: "نتایج خوداظهاری رزومه هستند و زمینه هر همکاری متفاوت است.", selectedWork: "کارهای منتخب", present: "اکنون", copy: "کپی", copied: "کپی شد", spokenLanguages: "زبان‌های گفتاری", education: "تحصیلات", awards: "جوایز", professionalProjects: "پروژه‌های حرفه‌ای", githubRepositories: "مخازن گیت‌هاب", snapshot: "نمای گیت‌هاب", viewDetails: "مشاهده جزئیات" },
  content: {
    aboutDelivery: "انضباط معماری را برای تحویل بهتر می‌خواهم: دامنه را بفهمیم، مرزها را شفاف کنیم، شواهد را خودکار کنیم و راه‌حل را متناسب با مسئله نگه داریم.",
    engineeringApproach: "رویکرد مهندسی",
    principles: [
      { title: "ابتدا دامنه", description: "پیش از انتخاب الگو یا مرز، یک زبان مشترک بسازیم." },
      { title: "مرزهای روشن", description: "تصمیم‌های کسب‌وکار را از انتقال، ذخیره‌سازی و فریم‌ورک جدا کنیم." },
      { title: "اثبات رفتار", description: "TDD را عادت و BDD را راهی برای اجرایی‌کردن نیت بدانیم." },
      { title: "تحویل عمل‌گرایانه", description: "DDD و CQRS را جایی به‌کار ببریم که پیچیدگی توجیه‌شان می‌کند." },
    ],
    olympiad: "دو دوره حضور در المپیاد منطقه‌ای ریاضی · مقام چهارم",
    publicationNoteTitle: "یادداشت انتشار",
    publicationNoteBody: "در رزومه ارائه‌شده انتشار تألیفی پیشین وجود نداشت. این بخش با مطالعه موردی شفاف همین ساخت ۲۰۲۶ آغاز می‌شود و ایده‌های آینده برنامه‌ریزی‌شده باقی می‌مانند.",
    publishingSoon: "به‌زودی منتشر می‌شود",
    engineeringPractices: "روش‌های مهندسی",
    passed: "موفق",
    snapshotVolatile: "این اعداد تصویری تاریخ‌دار و متغیر هستند.",
    contactHeading: "با زمینه مسئله شروع کنیم.",
    contactBody: "مسئله، دامنه و تعریف نتیجه موفق را به اشتراک بگذارید. به‌ویژه به بک‌اند .NET، سامانه‌های توزیع‌شده، معماری و محصولات فول‌استک علاقه‌مندم.",
    emailNaser: "ایمیل به ناصر",
    coverLetter: "نامه معرفی",
    portraitAlt: "تصویر ناصر روحی",
    noMatchingCommand: "فرمانی پیدا نشد",
    skipToContent: "رفتن به محتوا",
    canonicalEnglishNote: "توضیحات حرفه‌ای زیر با متن اصلی انگلیسی حفظ شده‌اند.",
    tourStarted: "تور آغاز شد: پروفایل ← تجربه ← پروژه‌ها ← تماس.",
    years: "سال",
  },
});

const de = translated({
  nav: { overview: "Übersicht", about: "Über mich", experience: "Erfahrung", projects: "Projekte", skills: "Kompetenzen", articles: "Artikel", contact: "Kontakt" },
  pages: {
    overview: { title: "Systeme entwickeln, die skalieren und verständlich bleiben.", summary: "Senior Software Engineer mit Fokus auf pragmatische .NET-Architektur, verlässliche Lieferung und messbare Ergebnisse." },
    about: { title: "Architektonische Disziplin, verankert in der Umsetzung.", summary: "Zuerst die Domäne verstehen, klare Grenzen ziehen und DDD, CQRS sowie Tests dort einsetzen, wo sie Nutzen bringen." },
    experience: { title: "Acht Jahre in Reise, Finanzen, Luftfahrt und Datensystemen.", summary: "Eine Chronologie der Vollzeit- und klar gekennzeichneten Teilzeitarbeit." },
    projects: { title: "Ausgewählte Systeme, Repositories und Produkte.", summary: "Öffentliche Arbeit zu Domänenmodellierung, Tests, Algorithmen und pragmatischer Lieferung." },
    skills: { title: "Backend-Tiefe mit Full-Stack-Breite.", summary: "Ein .NET-zentriertes Toolkit für Architektur, Daten, Messaging, Frontend, Cloud und Tests." },
    articles: { title: "Praxisnotizen und transparente Fallstudien.", summary: "Eine neue Fallstudie dokumentiert dieses Portfolio; künftige Themen sind klar als geplant markiert." },
    contact: { title: "Lassen Sie uns etwas Verlässliches bauen.", summary: "E-Mail, LinkedIn und GitHub sind die besten Wege für ein erstes Gespräch." },
  },
  shell: { ...en.shell, workbench: "Portfolio Workbench", search: "Portfolio durchsuchen", searchPlaceholder: "Seite, Projekt oder Aktion eingeben…", explorer: "Projektmappen-Explorer", output: "Ausgabe", timeline: "Zeitleiste", file: "Datei", edit: "Bearbeiten", view: "Ansicht", navigate: "Navigieren", run: "Ausführen", tools: "Tools", help: "Hilfe", ready: "Bereit", runTour: "Portfolio-Tour starten", openResume: "Lebenslauf öffnen", downloadResume: "Lebenslauf laden", print: "Lebenslauf drucken", copyEmail: "E-Mail kopieren", commandPalette: "Befehlspalette", toggleExplorer: "Explorer umschalten", toggleOutput: "Ausgabe umschalten", changeTheme: "Design wechseln", changeLanguage: "Sprache wechseln", shortcuts: "Tastaturkürzel", close: "Schließen", back: "Zurück", forward: "Vorwärts", openMenu: "Menü öffnen", filterExplorer: "Explorer filtern", externalLink: "Öffnet in neuem Tab" },
  common: { partTime: "Teilzeit", fullTime: "Vollzeit", featured: "Empfohlen", repository: "Repository", liveSite: "Live-Website", caseStudy: "Fallstudie", planned: "Geplant", englishContent: "Englischer Inhalt", readTime: "Min. Lesezeit", professionalOutcomes: "Ausgewählte berufliche Ergebnisse", outcomesNote: "Selbst berichtete Ergebnisse aus dem Lebenslauf; der Kontext variiert je Auftrag.", selectedWork: "Ausgewählte Arbeiten", present: "Heute", copy: "Kopieren", copied: "Kopiert", spokenLanguages: "Gesprochene Sprachen", education: "Ausbildung", awards: "Auszeichnungen", professionalProjects: "Berufliche Projekte", githubRepositories: "GitHub-Repositories", snapshot: "GitHub-Momentaufnahme", viewDetails: "Details ansehen" },
  content: {
    aboutDelivery: "Ich setze auf architektonische Disziplin, die Teams beim Liefern unterstützt: Domäne verstehen, Grenzen explizit machen, Nachweise automatisieren und die Lösung dem Problem angemessen halten.",
    engineeringApproach: "Engineering-Ansatz",
    principles: [
      { title: "Domäne zuerst", description: "Eine gemeinsame Sprache schaffen, bevor Muster oder Grenzen gewählt werden." },
      { title: "Klare Grenzen", description: "Geschäftsentscheidungen von Transport, Speicherung und Frameworks trennen." },
      { title: "Verhalten beweisen", description: "TDD als Gewohnheit und BDD als ausführbare Absicht behandeln." },
      { title: "Pragmatisch liefern", description: "DDD und CQRS dort einsetzen, wo die Komplexität sie rechtfertigt." },
    ],
    olympiad: "Zweimal regionale Mathematik-Olympiade · 4. Platz",
    publicationNoteTitle: "Hinweis zur Veröffentlichung",
    publicationNoteBody: "Im bereitgestellten Lebenslauf wurden keine früheren eigenen Publikationen gefunden. Dieser Bereich beginnt mit einer transparenten Fallstudie dieses Builds von 2026; künftige Ideen bleiben als geplant gekennzeichnet.",
    publishingSoon: "erscheint demnächst",
    engineeringPractices: "Engineering-Praktiken",
    passed: "Bestanden",
    snapshotVolatile: "Die Zahlen sind eine datierte, veränderliche Momentaufnahme.",
    contactHeading: "Beginnen wir mit dem Kontext.",
    contactBody: "Beschreiben Sie Problem, Domäne und das gewünschte Ergebnis. Besonders interessieren mich .NET-Backend, verteilte Systeme, Architektur und Full-Stack-Produkte.",
    emailNaser: "E-Mail an Naser",
    coverLetter: "Anschreiben",
    portraitAlt: "Porträt von Naser Rouhi",
    noMatchingCommand: "Kein passender Befehl",
    skipToContent: "Zum Inhalt springen",
    canonicalEnglishNote: "Die folgenden beruflichen Beschreibungen bleiben im englischen Originalwortlaut.",
    tourStarted: "Tour gestartet: Profil → Erfahrung → Projekte → Kontakt.",
    years: "Jahre",
  },
});

const fr = translated({
  nav: { overview: "Aperçu", about: "À propos", experience: "Expérience", projects: "Projets", skills: "Compétences", articles: "Articles", contact: "Contact" },
  pages: {
    overview: { title: "Concevoir des systèmes qui évoluent et restent compréhensibles.", summary: "Senior Software Engineer, spécialisé en architecture .NET pragmatique, livraison fiable et résultats mesurables." },
    about: { title: "La discipline architecturale au service de la livraison.", summary: "Comprendre le domaine, tracer des limites propres et utiliser DDD, CQRS et les tests là où ils apportent une vraie valeur." },
    experience: { title: "Huit ans dans le voyage, la finance, l’aviation et les données.", summary: "Une chronologie des expériences à temps plein et à temps partiel clairement signalées." },
    projects: { title: "Systèmes, dépôts et produits sélectionnés.", summary: "Des travaux publics illustrant modélisation métier, tests, algorithmes et livraison pragmatique." },
    skills: { title: "Une expertise backend avec une portée full-stack.", summary: "Un ensemble d’outils centré sur .NET : architecture, données, messaging, frontend, cloud et tests." },
    articles: { title: "Notes de terrain et études de cas transparentes.", summary: "Une nouvelle étude documente ce portfolio ; les futurs sujets sont clairement indiqués comme prévus." },
    contact: { title: "Construisons quelque chose de fiable.", summary: "L’e-mail, LinkedIn et GitHub sont les meilleurs moyens de commencer." },
  },
  shell: { ...en.shell, workbench: "Atelier Portfolio", search: "Rechercher", searchPlaceholder: "Saisissez une page, un projet ou une action…", explorer: "Explorateur de solution", output: "Sortie", timeline: "Chronologie", file: "Fichier", edit: "Édition", view: "Affichage", navigate: "Navigation", run: "Exécuter", tools: "Outils", help: "Aide", ready: "Prêt", runTour: "Lancer la visite", openResume: "Ouvrir le CV", downloadResume: "Télécharger le CV", print: "Imprimer le CV", copyEmail: "Copier l’e-mail", commandPalette: "Palette de commandes", toggleExplorer: "Afficher l’explorateur", toggleOutput: "Afficher la sortie", changeTheme: "Changer de thème", changeLanguage: "Changer de langue", shortcuts: "Raccourcis clavier", close: "Fermer", back: "Retour", forward: "Suivant", openMenu: "Ouvrir le menu", filterExplorer: "Filtrer l’explorateur", externalLink: "S’ouvre dans un nouvel onglet" },
  common: { partTime: "Temps partiel", fullTime: "Temps plein", featured: "À la une", repository: "Dépôt", liveSite: "Site en ligne", caseStudy: "Étude de cas", planned: "Prévu", englishContent: "Contenu en anglais", readTime: "min de lecture", professionalOutcomes: "Résultats professionnels sélectionnés", outcomesNote: "Résultats autodéclarés du CV ; le contexte varie selon la mission.", selectedWork: "Travaux sélectionnés", present: "Aujourd’hui", copy: "Copier", copied: "Copié", spokenLanguages: "Langues parlées", education: "Formation", awards: "Distinctions", professionalProjects: "Projets professionnels", githubRepositories: "Dépôts GitHub", snapshot: "Instantané GitHub", viewDetails: "Voir les détails" },
  content: {
    aboutDelivery: "Je privilégie une discipline architecturale qui aide les équipes à livrer : comprendre le domaine, expliciter les frontières, automatiser la preuve et garder une solution proportionnée au problème.",
    engineeringApproach: "Approche d’ingénierie",
    principles: [
      { title: "Le domaine d’abord", description: "Construire un langage commun avant de choisir les modèles ou les frontières." },
      { title: "Frontières nettes", description: "Séparer les décisions métier du transport, du stockage et des frameworks." },
      { title: "Prouver le comportement", description: "Faire du TDD une habitude et du BDD une intention exécutable." },
      { title: "Livrer avec pragmatisme", description: "Utiliser DDD et CQRS lorsque la complexité les justifie vraiment." },
    ],
    olympiad: "Deux participations à l’Olympiade régionale de mathématiques · 4e place",
    publicationNoteTitle: "Note de publication",
    publicationNoteBody: "Aucune publication antérieure rédigée par l’auteur n’a été trouvée dans le CV fourni. Cette section commence par une étude transparente de cette réalisation 2026 ; les idées futures restent marquées comme prévues.",
    publishingSoon: "publication prochaine",
    engineeringPractices: "Pratiques d’ingénierie",
    passed: "Réussi",
    snapshotVolatile: "Ces chiffres constituent un instantané daté et évolutif.",
    contactHeading: "Commençons par le contexte.",
    contactBody: "Partagez le problème, le domaine et la définition d’un résultat réussi. Je m’intéresse particulièrement au backend .NET, aux systèmes distribués, à l’architecture et aux produits full-stack.",
    emailNaser: "Écrire à Naser",
    coverLetter: "Lettre de motivation",
    portraitAlt: "Portrait de Naser Rouhi",
    noMatchingCommand: "Aucune commande correspondante",
    skipToContent: "Aller au contenu",
    canonicalEnglishNote: "Les descriptions professionnelles ci-dessous conservent leur formulation anglaise d’origine.",
    tourStarted: "Visite lancée : profil → expérience → projets → contact.",
    years: "ans",
  },
});

const nl = translated({
  nav: { overview: "Overzicht", about: "Over mij", experience: "Ervaring", projects: "Projecten", skills: "Vaardigheden", articles: "Artikelen", contact: "Contact" },
  pages: {
    overview: { title: "Systemen bouwen die schalen en begrijpelijk blijven.", summary: "Senior Software Engineer gericht op pragmatische .NET-architectuur, betrouwbare levering en meetbare resultaten." },
    about: { title: "Architecturale discipline, geworteld in levering.", summary: "Eerst het domein begrijpen, heldere grenzen trekken en DDD, CQRS en tests inzetten waar ze echt helpen." },
    experience: { title: "Acht jaar in reizen, financiën, luchtvaart en datasystemen.", summary: "Een tijdlijn van voltijds en duidelijk gemarkeerd deeltijds professioneel werk." },
    projects: { title: "Geselecteerde systemen, repositories en producten.", summary: "Openbaar werk rond domeinmodellering, tests, algoritmen en pragmatische levering." },
    skills: { title: "Backend-diepte met full-stack-breedte.", summary: "Een .NET-gerichte toolkit voor architectuur, data, messaging, frontend, cloud en testen." },
    articles: { title: "Praktijknotities en transparante casestudy’s.", summary: "Eén nieuwe casestudy documenteert dit portfolio; toekomstige onderwerpen zijn duidelijk als gepland gemarkeerd." },
    contact: { title: "Laten we iets betrouwbaars bouwen.", summary: "E-mail, LinkedIn en GitHub zijn de beste manieren om een gesprek te beginnen." },
  },
  shell: { ...en.shell, workbench: "Portfolio Werkbank", search: "Portfolio doorzoeken", searchPlaceholder: "Typ een pagina, project of actie…", explorer: "Solution Explorer", output: "Uitvoer", timeline: "Tijdlijn", file: "Bestand", edit: "Bewerken", view: "Beeld", navigate: "Navigeren", run: "Uitvoeren", tools: "Extra", help: "Help", ready: "Gereed", runTour: "Portfolio-tour starten", openResume: "Cv openen", downloadResume: "Cv downloaden", print: "Cv afdrukken", copyEmail: "E-mail kopiëren", commandPalette: "Opdrachtenpalet", toggleExplorer: "Explorer tonen", toggleOutput: "Uitvoer tonen", changeTheme: "Thema wijzigen", changeLanguage: "Taal wijzigen", shortcuts: "Sneltoetsen", close: "Sluiten", back: "Terug", forward: "Vooruit", openMenu: "Menu openen", filterExplorer: "Explorer filteren", externalLink: "Opent in nieuw tabblad" },
  common: { partTime: "Deeltijds", fullTime: "Voltijds", featured: "Uitgelicht", repository: "Repository", liveSite: "Live site", caseStudy: "Casestudy", planned: "Gepland", englishContent: "Engelse inhoud", readTime: "min leestijd", professionalOutcomes: "Geselecteerde professionele resultaten", outcomesNote: "Zelfgerapporteerde resultaten uit het cv; context verschilt per opdracht.", selectedWork: "Geselecteerd werk", present: "Heden", copy: "Kopiëren", copied: "Gekopieerd", spokenLanguages: "Gesproken talen", education: "Opleiding", awards: "Onderscheidingen", professionalProjects: "Professionele projecten", githubRepositories: "GitHub-repositories", snapshot: "GitHub-momentopname", viewDetails: "Details bekijken" },
  content: {
    aboutDelivery: "Ik kies voor architecturale discipline die teams helpt leveren: begrijp het domein, maak grenzen expliciet, automatiseer het bewijs en houd de oplossing in verhouding tot het probleem.",
    engineeringApproach: "Engineeringaanpak",
    principles: [
      { title: "Domein eerst", description: "Bouw een gedeelde taal voordat patronen of grenzen worden gekozen." },
      { title: "Heldere grenzen", description: "Scheid bedrijfsbeslissingen van transport, opslag en frameworks." },
      { title: "Gedrag bewijzen", description: "Behandel TDD als gewoonte en BDD als uitvoerbare intentie." },
      { title: "Pragmatisch leveren", description: "Gebruik DDD en CQRS waar de complexiteit ze rechtvaardigt." },
    ],
    olympiad: "Tweemaal regionale Wiskundeolympiade · 4e plaats",
    publicationNoteTitle: "Publicatienotitie",
    publicationNoteBody: "In het aangeleverde cv zijn geen eerdere eigen publicaties gevonden. Dit onderdeel begint met een transparante casestudy van deze build uit 2026; toekomstige ideeën blijven als gepland gemarkeerd.",
    publishingSoon: "verschijnt binnenkort",
    engineeringPractices: "Engineeringpraktijken",
    passed: "Geslaagd",
    snapshotVolatile: "De aantallen zijn een gedateerde, veranderlijke momentopname.",
    contactHeading: "Begin met de context.",
    contactBody: "Deel het probleem, het domein en hoe een succesvol resultaat eruitziet. Ik ben vooral geïnteresseerd in .NET-backend, gedistribueerde systemen, architectuur en full-stackproducten.",
    emailNaser: "E-mail Naser",
    coverLetter: "Motivatiebrief",
    portraitAlt: "Portret van Naser Rouhi",
    noMatchingCommand: "Geen overeenkomende opdracht",
    skipToContent: "Naar inhoud",
    canonicalEnglishNote: "De professionele beschrijvingen hieronder blijven in hun oorspronkelijke Engelse bewoording.",
    tourStarted: "Tour gestart: profiel → ervaring → projecten → contact.",
    years: "jaar",
  },
});

const es = translated({
  nav: { overview: "Resumen", about: "Acerca de", experience: "Experiencia", projects: "Proyectos", skills: "Habilidades", articles: "Artículos", contact: "Contacto" },
  pages: {
    overview: { title: "Sistemas que escalan y siguen siendo comprensibles.", summary: "Senior Software Engineer centrado en arquitectura .NET pragmática, entregas fiables y resultados medibles." },
    about: { title: "Disciplina arquitectónica orientada a la entrega.", summary: "Entender primero el dominio, definir límites claros y aplicar DDD, CQRS y pruebas cuando generan valor real." },
    experience: { title: "Ocho años en viajes, finanzas, aviación y sistemas de datos.", summary: "Una cronología de trabajo a tiempo completo y parcial claramente identificado." },
    projects: { title: "Sistemas, repositorios y productos seleccionados.", summary: "Trabajo público que muestra modelado de dominio, pruebas, algoritmos y entrega pragmática." },
    skills: { title: "Profundidad backend con amplitud full-stack.", summary: "Un conjunto centrado en .NET para arquitectura, datos, mensajería, frontend, nube y pruebas." },
    articles: { title: "Notas prácticas y casos de estudio transparentes.", summary: "Un nuevo caso documenta este portfolio; los temas futuros aparecen claramente como planificados." },
    contact: { title: "Construyamos algo fiable.", summary: "Correo electrónico, LinkedIn y GitHub son las mejores formas de empezar." },
  },
  shell: { ...en.shell, workbench: "Banco de Portfolio", search: "Buscar portfolio", searchPlaceholder: "Escribe una página, proyecto o acción…", explorer: "Explorador de soluciones", output: "Salida", timeline: "Cronología", file: "Archivo", edit: "Editar", view: "Ver", navigate: "Navegar", run: "Ejecutar", tools: "Herramientas", help: "Ayuda", ready: "Listo", runTour: "Iniciar recorrido", openResume: "Abrir currículum", downloadResume: "Descargar currículum", print: "Imprimir currículum", copyEmail: "Copiar correo", commandPalette: "Paleta de comandos", toggleExplorer: "Alternar explorador", toggleOutput: "Alternar salida", changeTheme: "Cambiar tema", changeLanguage: "Cambiar idioma", shortcuts: "Atajos de teclado", close: "Cerrar", back: "Atrás", forward: "Adelante", openMenu: "Abrir menú", filterExplorer: "Filtrar explorador", externalLink: "Se abre en una pestaña nueva" },
  common: { partTime: "Tiempo parcial", fullTime: "Tiempo completo", featured: "Destacado", repository: "Repositorio", liveSite: "Sitio en vivo", caseStudy: "Caso de estudio", planned: "Planificado", englishContent: "Contenido en inglés", readTime: "min de lectura", professionalOutcomes: "Resultados profesionales seleccionados", outcomesNote: "Resultados autodeclarados del currículum; el contexto varía por trabajo.", selectedWork: "Trabajo seleccionado", present: "Presente", copy: "Copiar", copied: "Copiado", spokenLanguages: "Idiomas hablados", education: "Educación", awards: "Premios", professionalProjects: "Proyectos profesionales", githubRepositories: "Repositorios de GitHub", snapshot: "Instantánea de GitHub", viewDetails: "Ver detalles" },
  content: {
    aboutDelivery: "Prefiero una disciplina arquitectónica que ayude a entregar: comprender el dominio, hacer explícitos los límites, automatizar la evidencia y mantener la solución proporcionada al problema.",
    engineeringApproach: "Enfoque de ingeniería",
    principles: [
      { title: "Primero el dominio", description: "Construir un lenguaje compartido antes de elegir patrones o límites." },
      { title: "Límites claros", description: "Separar decisiones de negocio de transporte, almacenamiento y frameworks." },
      { title: "Probar el comportamiento", description: "Tratar TDD como hábito y BDD como intención ejecutable." },
      { title: "Entregar con pragmatismo", description: "Usar DDD y CQRS donde la complejidad realmente los justifique." },
    ],
    olympiad: "Dos participaciones en la Olimpiada regional de Matemáticas · 4.º puesto",
    publicationNoteTitle: "Nota de publicación",
    publicationNoteBody: "No se encontraron publicaciones anteriores de autoría propia en el currículum aportado. Esta sección empieza con un caso transparente de esta construcción de 2026; las ideas futuras siguen marcadas como planificadas.",
    publishingSoon: "próxima publicación",
    engineeringPractices: "Prácticas de ingeniería",
    passed: "Superado",
    snapshotVolatile: "Las cifras son una instantánea fechada y cambiante.",
    contactHeading: "Empecemos por el contexto.",
    contactBody: "Comparte el problema, el dominio y cómo sería un resultado exitoso. Me interesan especialmente backend .NET, sistemas distribuidos, arquitectura y productos full-stack.",
    emailNaser: "Enviar correo a Naser",
    coverLetter: "Carta de presentación",
    portraitAlt: "Retrato de Naser Rouhi",
    noMatchingCommand: "No hay comandos coincidentes",
    skipToContent: "Ir al contenido",
    canonicalEnglishNote: "Las descripciones profesionales siguientes conservan su redacción original en inglés.",
    tourStarted: "Recorrido iniciado: perfil → experiencia → proyectos → contacto.",
    years: "años",
  },
});

const ar = translated({
  nav: { overview: "نظرة عامة", about: "نبذة", experience: "الخبرة", projects: "المشاريع", skills: "المهارات", articles: "المقالات", contact: "التواصل" },
  pages: {
    overview: { title: "هندسة أنظمة تتوسع وتبقى مفهومة.", summary: "مهندس برمجيات أول يركز على معمارية .NET العملية والتسليم الموثوق والنتائج القابلة للقياس." },
    about: { title: "انضباط معماري مرتبط بالتسليم.", summary: "فهم المجال أولاً، ورسم حدود واضحة، واستخدام DDD وCQRS والاختبارات حيث تحقق قيمة حقيقية." },
    experience: { title: "ثماني سنوات في السفر والتمويل والطيران وأنظمة البيانات.", summary: "تسلسل زمني للعمل بدوام كامل والعمل الجزئي المميز بوضوح." },
    projects: { title: "أنظمة ومستودعات ومنتجات مختارة.", summary: "عمل عام يوضح نمذجة المجال والاختبارات والخوارزميات والتسليم العملي." },
    skills: { title: "عمق في الخلفية مع خبرة متكاملة.", summary: "مجموعة أدوات تتمحور حول .NET للمعمارية والبيانات والرسائل والواجهة والسحابة والاختبارات." },
    articles: { title: "ملاحظات عملية ودراسات حالة شفافة.", summary: "دراسة جديدة توثق بناء هذا الملف؛ والموضوعات المستقبلية موسومة بوضوح كمخططة." },
    contact: { title: "لنبنِ شيئاً موثوقاً.", summary: "البريد الإلكتروني وLinkedIn وGitHub هي أفضل طرق بدء الحوار." },
  },
  shell: { ...en.shell, workbench: "منضدة الأعمال", search: "بحث في الملف", searchPlaceholder: "اكتب صفحة أو مشروعاً أو إجراءً…", explorer: "مستكشف الحل", output: "المخرجات", timeline: "الخط الزمني", file: "ملف", edit: "تحرير", view: "عرض", navigate: "تنقل", run: "تشغيل", tools: "أدوات", help: "مساعدة", ready: "جاهز", runTour: "تشغيل الجولة", openResume: "فتح السيرة", downloadResume: "تنزيل السيرة", print: "طباعة السيرة الذاتية", copyEmail: "نسخ البريد", commandPalette: "لوحة الأوامر", toggleExplorer: "تبديل المستكشف", toggleOutput: "تبديل المخرجات", changeTheme: "تغيير السمة", changeLanguage: "تغيير اللغة", shortcuts: "اختصارات لوحة المفاتيح", close: "إغلاق", back: "رجوع", forward: "تقدم", openMenu: "فتح القائمة", filterExplorer: "تصفية المستكشف", externalLink: "يفتح في علامة تبويب جديدة" },
  common: { partTime: "دوام جزئي", fullTime: "دوام كامل", featured: "مميز", repository: "المستودع", liveSite: "الموقع المباشر", caseStudy: "دراسة حالة", planned: "مخطط", englishContent: "محتوى إنجليزي", readTime: "دقائق قراءة", professionalOutcomes: "نتائج مهنية مختارة", outcomesNote: "نتائج مذكورة ذاتياً في السيرة؛ يختلف السياق حسب العمل.", selectedWork: "أعمال مختارة", present: "حتى الآن", copy: "نسخ", copied: "تم النسخ", spokenLanguages: "اللغات المحكية", education: "التعليم", awards: "الجوائز", professionalProjects: "المشاريع المهنية", githubRepositories: "مستودعات GitHub", snapshot: "لقطة GitHub", viewDetails: "عرض التفاصيل" },
  content: {
    aboutDelivery: "أفضل الانضباط المعماري الذي يساعد الفرق على التسليم: فهم المجال، وتوضيح الحدود، وأتمتة الدليل، وإبقاء الحل متناسباً مع المشكلة.",
    engineeringApproach: "النهج الهندسي",
    principles: [
      { title: "المجال أولاً", description: "بناء لغة مشتركة قبل اختيار الأنماط أو الحدود." },
      { title: "حدود واضحة", description: "فصل قرارات العمل عن النقل والتخزين وأطر العمل." },
      { title: "إثبات السلوك", description: "اعتبار TDD عادة وBDD وسيلة لجعل النية قابلة للتنفيذ." },
      { title: "تسليم عملي", description: "استخدام DDD وCQRS عندما يبرر التعقيد ذلك فعلاً." },
    ],
    olympiad: "مشاركة مرتين في أولمبياد الرياضيات الإقليمي · المركز الرابع",
    publicationNoteTitle: "ملاحظة النشر",
    publicationNoteBody: "لم تظهر منشورات سابقة من تأليف صاحب السيرة في السيرة المقدمة. يبدأ هذا القسم بدراسة شفافة لهذا البناء لعام 2026، وتبقى الأفكار المستقبلية موسومة كمخططة.",
    publishingSoon: "سينشر قريباً",
    engineeringPractices: "ممارسات هندسية",
    passed: "ناجح",
    snapshotVolatile: "هذه الأرقام لقطة مؤرخة ومتغيرة.",
    contactHeading: "لنبدأ بالسياق.",
    contactBody: "شارك المشكلة والمجال وشكل النتيجة الناجحة. أهتم خصوصاً بخلفية .NET والأنظمة الموزعة والمعمارية والمنتجات المتكاملة.",
    emailNaser: "مراسلة ناصر",
    coverLetter: "خطاب التعريف",
    portraitAlt: "صورة ناصر روحي",
    noMatchingCommand: "لا يوجد أمر مطابق",
    skipToContent: "الانتقال إلى المحتوى",
    canonicalEnglishNote: "تُحفظ الأوصاف المهنية أدناه بصياغتها الإنجليزية الأصلية.",
    tourStarted: "بدأت الجولة: الملف ← الخبرة ← المشاريع ← التواصل.",
    years: "سنوات",
  },
});

const tr = translated({
  nav: { overview: "Genel bakış", about: "Hakkımda", experience: "Deneyim", projects: "Projeler", skills: "Yetenekler", articles: "Makaleler", contact: "İletişim" },
  pages: {
    overview: { title: "Ölçeklenen ve anlaşılır kalan sistemler.", summary: "Pragmatik .NET mimarisi, güvenilir teslimat ve ölçülebilir sonuçlara odaklanan Kıdemli Yazılım Mühendisi." },
    about: { title: "Teslimata dayanan mimari disiplin.", summary: "Önce alanı anlamak, temiz sınırlar çizmek ve DDD, CQRS ile testleri gerçek değer ürettikleri yerde kullanmak." },
    experience: { title: "Seyahat, finans, havacılık ve veri sistemlerinde sekiz yıl.", summary: "Tam zamanlı ve açıkça belirtilmiş yarı zamanlı çalışmaların kronolojisi." },
    projects: { title: "Seçilmiş sistemler, depolar ve ürünler.", summary: "Alan modelleme, test, algoritma ve pragmatik teslimatı gösteren açık çalışmalar." },
    skills: { title: "Full-stack genişliğiyle backend derinliği.", summary: "Mimari, veri, mesajlaşma, frontend, bulut ve testleri kapsayan .NET merkezli araç seti." },
    articles: { title: "Saha notları ve şeffaf vaka çalışmaları.", summary: "Yeni bir vaka çalışması bu portföyü belgeler; gelecek konular açıkça planlanan olarak işaretlenir." },
    contact: { title: "Güvenilir bir şey inşa edelim.", summary: "E-posta, LinkedIn ve GitHub iletişim kurmanın en iyi yollarıdır." },
  },
  shell: { ...en.shell, workbench: "Portföy Çalışma Alanı", search: "Portföyde ara", searchPlaceholder: "Sayfa, proje veya eylem yazın…", explorer: "Çözüm Gezgini", output: "Çıktı", timeline: "Zaman çizelgesi", file: "Dosya", edit: "Düzenle", view: "Görünüm", navigate: "Gezin", run: "Çalıştır", tools: "Araçlar", help: "Yardım", ready: "Hazır", runTour: "Portföy turunu başlat", openResume: "Özgeçmişi aç", downloadResume: "Özgeçmişi indir", print: "Özgeçmişi yazdır", copyEmail: "E-postayı kopyala", commandPalette: "Komut paleti", toggleExplorer: "Gezgini aç/kapat", toggleOutput: "Çıktıyı aç/kapat", changeTheme: "Temayı değiştir", changeLanguage: "Dili değiştir", shortcuts: "Klavye kısayolları", close: "Kapat", back: "Geri", forward: "İleri", openMenu: "Menüyü aç", filterExplorer: "Gezgini filtrele", externalLink: "Yeni sekmede açılır" },
  common: { partTime: "Yarı zamanlı", fullTime: "Tam zamanlı", featured: "Öne çıkan", repository: "Depo", liveSite: "Canlı site", caseStudy: "Vaka çalışması", planned: "Planlandı", englishContent: "İngilizce içerik", readTime: "dk okuma", professionalOutcomes: "Seçilmiş profesyonel sonuçlar", outcomesNote: "Özgeçmişte bildirilen sonuçlar; bağlam çalışmaya göre değişir.", selectedWork: "Seçilmiş işler", present: "Günümüz", copy: "Kopyala", copied: "Kopyalandı", spokenLanguages: "Konuşulan diller", education: "Eğitim", awards: "Ödüller", professionalProjects: "Profesyonel projeler", githubRepositories: "GitHub depoları", snapshot: "GitHub anlık görüntüsü", viewDetails: "Ayrıntıları gör" },
  content: {
    aboutDelivery: "Ekiplerin teslim etmesine yardımcı olan mimari disiplini tercih ederim: alanı anlayın, sınırları açık kılın, kanıtı otomatikleştirin ve çözümü problemle orantılı tutun.",
    engineeringApproach: "Mühendislik yaklaşımı",
    principles: [
      { title: "Önce alan", description: "Desenleri veya sınırları seçmeden önce ortak bir dil kurun." },
      { title: "Temiz sınırlar", description: "İş kararlarını taşıma, depolama ve framework kaygılarından ayırın." },
      { title: "Davranışı kanıtla", description: "TDD’yi alışkanlık, BDD’yi niyeti çalıştırma yolu olarak ele alın." },
      { title: "Pragmatik teslimat", description: "DDD ve CQRS’yi karmaşıklığın gerçekten hak ettiği yerde kullanın." },
    ],
    olympiad: "İki kez bölgesel Matematik Olimpiyatı · 4.’lük",
    publicationNoteTitle: "Yayın notu",
    publicationNoteBody: "Sağlanan özgeçmişte daha önce yazılmış kişisel yayın bulunmadı. Bu bölüm 2026 yapımının şeffaf vaka çalışmasıyla başlar; gelecek fikirler planlandı olarak kalır.",
    publishingSoon: "yakında yayınlanacak",
    engineeringPractices: "Mühendislik uygulamaları",
    passed: "Başarılı",
    snapshotVolatile: "Sayılar tarihli ve değişken bir anlık görüntüdür.",
    contactHeading: "Bağlamla başlayalım.",
    contactBody: "Problemi, alanı ve başarılı sonucun nasıl göründüğünü paylaşın. Özellikle .NET backend, dağıtık sistemler, mimari ve full-stack ürünlerle ilgileniyorum.",
    emailNaser: "Naser’e e-posta",
    coverLetter: "Ön yazı",
    portraitAlt: "Naser Rouhi portresi",
    noMatchingCommand: "Eşleşen komut yok",
    skipToContent: "İçeriğe geç",
    canonicalEnglishNote: "Aşağıdaki profesyonel açıklamalar özgün İngilizce ifadeleriyle korunmuştur.",
    tourStarted: "Tur başladı: profil → deneyim → projeler → iletişim.",
    years: "yıl",
  },
});

export const dictionaries = { en, fa, de, fr, nl, es, ar, tr } satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
