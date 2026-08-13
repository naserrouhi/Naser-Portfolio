using NaserPortfolio.Domain.Articles;

namespace NaserPortfolio.Infrastructure.Articles;

public sealed class InMemoryArticleRepository : IArticleRepository
{
    private static readonly IReadOnlyList<Article> PublishedArticles = [CreatePortfolioCaseStudy()];

    public Task<IReadOnlyList<Article>> GetPublishedAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(PublishedArticles);
    }

    public Task<Article?> FindPublishedBySlugAsync(
        Slug slug,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(slug);
        cancellationToken.ThrowIfCancellationRequested();

        var article = PublishedArticles.SingleOrDefault(candidate => candidate.Slug == slug);
        return Task.FromResult(article);
    }

    private static Article CreatePortfolioCaseStudy()
    {
        var article = Article.CreateDraft(
            Guid.Parse("7ee391bc-fba7-4d76-aeb3-b2a740d88dbd"),
            Slug.Create("portfolio-workbench-case-study"),
            LocalizedText.Create(
                ("en", "Portfolio Workbench: a transparent 2026 case study"),
                ("fa", "کارگاه پورتفولیو: مطالعهٔ موردی شفاف ۲۰۲۶"),
                ("de", "Portfolio Workbench: eine transparente Fallstudie 2026"),
                ("fr", "Portfolio Workbench : une étude de cas transparente de 2026"),
                ("nl", "Portfolio Workbench: een transparante casestudy uit 2026")),
            LocalizedText.Create(
                ("en", "New documentation for this portfolio build—not a previously published article or historical publication claim."),
                ("fa", "مستند تازهٔ همین پروژهٔ پورتفولیو؛ نه مقاله‌ای قدیمی و نه ادعای انتشار پیشین."),
                ("de", "Neue Dokumentation dieses Portfolio-Builds – kein früher veröffentlichter Artikel und keine historische Publikationsangabe."),
                ("fr", "Une nouvelle documentation de ce portfolio, et non un article antérieur ni une revendication de publication passée."),
                ("nl", "Nieuwe documentatie van deze portfolio-build, niet een eerder artikel of een claim over een historische publicatie.")),
            LocalizedText.Create(
                ("en", "This case study documents the portfolio built in 2026. It is intentionally transparent: it was created with this site and does not represent an earlier publication. The backend uses a small Article aggregate to protect publication rules, immutable localized text and slug value objects, application query handlers, and outward adapters for résumé and GitHub data. The API remains a delivery mechanism, while business decisions stay in the domain model. Automated domain, application, integration, and Gherkin acceptance tests make those boundaries executable."),
                ("fa", "این مطالعهٔ موردی ساخت پورتفولیو در سال ۲۰۲۶ را مستند می‌کند. متن عمداً شفاف است: هم‌زمان با همین سایت ساخته شده و مقاله‌ای از گذشته نیست. بک‌اند از یک اگریگیت کوچک مقاله برای حفاظت از قوانین انتشار، آبجکت‌های مقدار تغییرناپذیر برای متن چندزبانه و اسلاگ، هندلرهای کوئری در لایهٔ کاربرد و آداپترهای بیرونی برای داده‌های رزومه و گیت‌هاب استفاده می‌کند. API فقط سازوکار ارائه است و تصمیم‌های کسب‌وکار در مدل دامنه می‌مانند. تست‌های دامنه، کاربرد، یکپارچه‌سازی و پذیرش گرکین این مرزها را قابل اجرا می‌کنند."),
                ("de", "Diese Fallstudie dokumentiert das im Jahr 2026 erstellte Portfolio. Sie ist bewusst transparent: Der Text entstand zusammen mit dieser Website und ist keine frühere Veröffentlichung. Das Backend nutzt ein kleines Article-Aggregat für Publikationsregeln, unveränderliche Value Objects für lokalisierte Texte und Slugs, Query-Handler in der Anwendungsschicht sowie Adapter für Lebenslauf- und GitHub-Daten. Die API bleibt ein Auslieferungsmechanismus, während Geschäftsentscheidungen im Domänenmodell liegen. Automatisierte Domänen-, Anwendungs-, Integrations- und Gherkin-Akzeptanztests machen diese Grenzen ausführbar."),
                ("fr", "Cette étude de cas documente le portfolio construit en 2026. Elle est volontairement transparente : le texte a été créé avec ce site et ne constitue pas une publication antérieure. Le backend emploie un petit agrégat Article pour protéger les règles de publication, des objets-valeurs immuables pour le texte localisé et les slugs, des gestionnaires de requêtes applicatifs et des adaptateurs pour les données du CV et de GitHub. L’API reste un mécanisme de livraison tandis que les décisions métier demeurent dans le modèle de domaine. Des tests automatisés de domaine, d’application, d’intégration et d’acceptation Gherkin rendent ces frontières exécutables."),
                ("nl", "Deze casestudy beschrijft het portfolio dat in 2026 is gebouwd. De tekst is bewust transparant: hij is samen met deze site gemaakt en is geen eerdere publicatie. De backend gebruikt een klein Article-aggregate voor publicatieregels, onveranderlijke value objects voor gelokaliseerde tekst en slugs, queryhandlers in de applicatielaag en adapters voor cv- en GitHub-gegevens. De API blijft een aflevermechanisme, terwijl zakelijke beslissingen in het domeinmodel blijven. Geautomatiseerde domein-, applicatie-, integratie- en Gherkin-acceptatietests maken die grenzen uitvoerbaar.")),
            ["portfolio", "case-study", ".net", "ddd", "clean-architecture"],
            new DateTimeOffset(2026, 8, 8, 0, 0, 0, TimeSpan.Zero));

        article.Publish(new DateTimeOffset(2026, 8, 8, 12, 0, 0, TimeSpan.Zero));
        article.ClearDomainEvents();
        return article;
    }
}
