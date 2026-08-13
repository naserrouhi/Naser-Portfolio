import { expect, test } from "@playwright/test";

test("renders the localized workbench and navigates route-backed documents", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1, name: "Naser Rouhi" })).toBeVisible();
  await expect(page.locator(".workbench-shell")).toBeVisible();

  await page.getByRole("main").getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/projects$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Selected systems");
});

test("serves an RTL Persian interface", async ({ page }) => {
  await page.goto("/fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 2, name: /ساخت سامانه/ })).toBeVisible();
});

test("uses the keyboard command palette to change language", async ({ page }) => {
  const scriptRenderErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("script tag")) {
      scriptRenderErrors.push(message.text());
    }
  });

  await page.goto("/en");
  await expect(page.locator(".workbench-shell")).toBeVisible();
  await expect(page.locator(".title-search")).toBeEnabled();
  await page.keyboard.press("Control+K");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByPlaceholder("Type a page, project, or action…")).toBeFocused();
  await page.getByRole("dialog").getByRole("button", { name: /Deutsch/ }).click();
  await expect(page).toHaveURL(/\/de$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  expect(scriptRenderErrors).toEqual([]);
});

test("exposes responsive menus and persists a light theme", async ({ page }, testInfo) => {
  const scriptRenderErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("script tag")) {
      scriptRenderErrors.push(message.text());
    }
  });

  await page.goto("/en");

  if (testInfo.project.name.startsWith("mobile")) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("menuitem", { name: "About" })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.locator(".mobile-dock").getByRole("button", { name: "Change theme" }).click();
  } else {
    await page.getByRole("button", { name: "File", exact: true }).click();
    await expect(page.getByRole("menuitem", { name: "Open résumé" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Print résumé" })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.locator(".title-actions").getByRole("button", { name: "Change theme" }).click();
  }

  await expect(page.locator("html")).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
  expect(scriptRenderErrors).toEqual([]);
});

test("presents the complete résumé inside a C# Visual Studio solution", async ({ page }, testInfo) => {
  await page.goto("/en/experience");
  await expect(page.locator(".experience-timeline > li")).toHaveCount(6);
  await expect(page.getByText(/cutting average issue resolution time by over 40%/i)).toBeVisible();

  if (!testInfo.project.name.startsWith("mobile")) {
    await page.getByRole("tab", { name: "Timeline" }).click();
    await expect(page.locator(".output-timeline > li")).toHaveCount(6);

    const explorerSplitter = page.getByRole("separator", { name: "Resize Solution Explorer" });
    const initialWidth = Number(await explorerSplitter.getAttribute("aria-valuenow"));
    await explorerSplitter.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(explorerSplitter).toHaveAttribute("aria-valuenow", String(initialWidth + 16));

    await page.locator(".desktop-explorer").click();
    await expect(page.locator(".desktop-explorer")).toHaveClass(/is-pane-active/);
    await expect(page.getByText("Solution 'NaserPortfolio' (4 of 4 projects)")).toBeVisible();
    await expect(page.locator(".desktop-explorer .vs-solution-icon")).toHaveCount(1);
    await expect(page.locator(".desktop-explorer .vs-project-icon")).toHaveCount(4);
    await expect(page.locator(".desktop-explorer .vs-json-file-icon")).toHaveCount(1);
    await expect(page.locator(".desktop-explorer .vs-dockerfile-icon")).toHaveCount(1);
    await expect(page.getByText("appsettings.json", { exact: true })).toBeVisible();
    await expect(page.getByText("Dockerfile", { exact: true })).toBeVisible();
    await expect(page.getByText("Experience.cs", { exact: true }).first()).toBeVisible();
  }

  await page.goto("/en/contact");
  await expect(page.getByRole("link", { name: "naserrouhi.nomonia@gmail.com" })).toBeVisible();
  await expect(page.getByRole("link", { name: "+98 912 806 1286" })).toBeVisible();
});

test("closes every document and creates an editable C# class", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator(".document-tab")).toHaveCount(3);

  await page.getByRole("button", { name: "Close all tabs" }).click();
  await expect(page.locator(".document-tab")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No files are open" })).toBeVisible();

  await page.getByRole("button", { name: "New C# Class", exact: true }).click();
  await expect(page.locator(".document-tab")).toHaveCount(1);
  await expect(page.getByText("Class1.cs", { exact: true }).first()).toBeVisible();

  const editorSurface = page.locator(".csharp-editor");
  await expect(editorSurface).toHaveAttribute("data-editor-ready", "true");
  await expect(editorSurface).toHaveAttribute("data-editor-value", "namespace NaserPortfolio;\n\npublic class Class1\n{\n}\n");
  await editorSurface.locator(".monaco-editor").click({ position: { x: 240, y: 120 } });
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText("namespace NaserPortfolio;\n\npublic sealed class Customer\n{\n}\n");
  await expect(editorSurface).toHaveAttribute("data-editor-value", /public sealed class Customer/);

  await page.keyboard.press("Control+End");
  await page.keyboard.insertText("\nConsole.Wri");
  await page.keyboard.press("Control+Space");
  await expect(page.locator(".suggest-widget.visible")).toBeVisible();
  await expect(page.locator(".suggest-widget.visible").getByText("WriteLine", { exact: true }).first()).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Close Class1.cs" }).click();
  await expect(page.locator(".document-tab")).toHaveCount(0);
});

test("middle-click closes active page and C# class tabs without auxiliary navigation", async ({ context, page }) => {
  await page.goto("/en");
  await expect(page.locator(".document-tab")).toHaveCount(3);

  const portfolioTab = page.locator(".document-tab").filter({ hasText: "Portfolio.cs" });
  await expect(portfolioTab).toHaveClass(/is-active/);
  await portfolioTab.click({ button: "middle" });

  await expect(portfolioTab).toHaveCount(0);
  await expect(page.locator(".document-tab")).toHaveCount(2);
  await expect(page).toHaveURL(/\/en\/projects$/);
  await expect(page.locator(".document-tab.is-active")).toContainText("Projects.cs");
  expect(context.pages()).toHaveLength(1);

  await page.locator('.document-strip-action[aria-label="New C# class"]').click();
  const classTab = page.locator(".document-tab").filter({ hasText: "Class1.cs" });
  await expect(classTab).toHaveClass(/is-active/);
  await classTab.click({ button: "middle" });

  await expect(classTab).toHaveCount(0);
  await expect(page.locator(".document-tab")).toHaveCount(2);
  await expect(page).toHaveURL(/\/en\/articles$/);
  await expect(page.locator(".document-tab.is-active")).toContainText("Articles.cs");
  expect(context.pages()).toHaveLength(1);
});

test("shows only useful solution nodes and résumé achievement bullets", async ({ page }, testInfo) => {
  await page.goto("/en/experience");
  const firstExperience = page.locator(".experience-timeline > li").first();
  await expect(firstExperience.locator(".experience-summary")).toHaveCount(0);
  await expect(firstExperience.locator(".highlight-list > li")).toHaveCount(4);
  await expect(firstExperience.locator(".highlight-list")).toHaveCSS("list-style-type", "disc");

  if (!testInfo.project.name.startsWith("mobile")) {
    await expect(page.getByText("External Sources", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Properties", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Endpoints", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Errors", { exact: true })).toHaveCount(0);
    const solutionFolders = page.locator(".desktop-explorer .solution-tree summary");
    await expect(solutionFolders.filter({ hasText: /^tests$/ })).toHaveCount(0);
    await expect(solutionFolders.filter({ hasText: /^Projects$/ })).toHaveCount(0);
  }
});
