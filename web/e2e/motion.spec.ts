import { expect, test, type Locator } from "@playwright/test";

async function motionStyle(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      animationName: style.animationName,
      clipPath: style.clipPath,
      scale: style.scale,
      translate: style.translate,
    };
  });
}

test("brings the Visual Studio workbench and document to life", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en", { waitUntil: "commit" });

  const splash = page.locator(".startup-splash");
  const splashWindow = splash.locator(".startup-splash-window");
  await expect(splashWindow).toBeVisible();
  const splashBox = await splashWindow.boundingBox();
  const viewport = page.viewportSize();
  expect(splashBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(splashBox!.width).toBeLessThan(viewport!.width);
  expect(splashBox!.height).toBeLessThan(viewport!.height);
  expect(Number.parseFloat((await splash.evaluate((element) => getComputedStyle(element).animationDuration))))
    .toBeLessThan(2);
  await expect(splash).toHaveCount(0, { timeout: 2_000 });

  await expect(page.locator(".editor-document-motion")).toBeVisible();
  await expect.poll(async () => (await motionStyle(page.locator(".editor-document-motion"))).animationName)
    .toContain("editor-document-enter");
  await expect.poll(async () => (await motionStyle(page.locator(".portrait-frame"))).animationName)
    .toContain("content-pop-in");

  if (!testInfo.project.name.startsWith("mobile")) {
    const output = page.locator(".desktop-output");
    await expect.poll(async () => (await motionStyle(output.locator(".output-typewriter").first())).animationName)
      .toContain("output-text-write");

    await output.getByRole("tab", { name: "Timeline" }).click();
    await expect(output.locator(".output-typewriter-timeline")).toHaveCount(6);
    await expect.poll(async () => (await motionStyle(output.locator(".output-typewriter-timeline").first())).animationName)
      .toContain("output-text-write");
  } else {
    await page.locator(".mobile-dock").getByRole("button", { name: "Output" }).click();
    const output = page.locator(".sheet-surface .output-panel");
    await expect(output).toBeVisible();
    await output.getByRole("tab", { name: "Timeline" }).click();
    await expect(output.locator(".output-typewriter-timeline")).toHaveCount(6);
    const timelineWidth = await output.locator(".output-content").evaluate((element) => ({
      client: element.clientWidth,
      scroll: element.scrollWidth,
    }));
    expect(timelineWidth.scroll).toBeLessThanOrEqual(timelineWidth.client);
    await page.keyboard.press("Escape");
  }

  await page.keyboard.press("Control+K");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByPlaceholder("Type a page, project, or action…")).toBeFocused();
  expect((await motionStyle(dialog)).animationName).toContain("dialog-enter");
});

test("removes decorative motion when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");

  await expect(page.locator(".startup-splash")).toBeHidden();
  expect((await motionStyle(page.locator(".startup-workbench"))).animationName).toBe("none");

  for (const selector of [".editor-document-motion", ".portrait-frame", ".metric", ".desktop-output .output-typewriter"]) {
    const style = await motionStyle(page.locator(selector).first());
    expect(style.animationName).toBe("none");
    expect(style.translate).toBe("none");
  }
  expect((await motionStyle(page.locator(".desktop-output .output-typewriter").first())).clipPath).toBe("none");

  await page.keyboard.press("Control+K");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByPlaceholder("Type a page, project, or action…")).toBeFocused();
  const dialogStyle = await motionStyle(dialog);
  expect(dialogStyle.animationName).toBe("none");
  expect(dialogStyle.translate).toBe("none");
  expect(dialogStyle.scale).toBe("none");
});
