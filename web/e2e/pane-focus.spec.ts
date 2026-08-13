import { expect, test, type Locator } from "@playwright/test";

async function expectActiveBorder(pane: Locator) {
  await expect(pane).toHaveAttribute("data-pane-active", "true");
  const borderColor = await pane.evaluate((element) => getComputedStyle(element, "::after").borderTopColor);
  expect(borderColor).not.toBe("rgba(0, 0, 0, 0)");
}

test("moves the Visual Studio focus border between workbench panes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith("mobile"), "Desktop workbench panes are shown in mobile sheets.");

  await page.goto("/en");

  const editor = page.getByRole("region", { name: "Document editor" });
  const output = page.locator(".desktop-output");
  const explorer = page.locator(".desktop-explorer");

  await expectActiveBorder(editor);

  await explorer.click();
  await expectActiveBorder(explorer);
  await expect(editor).toHaveAttribute("data-pane-active", "false");
  await expect(output).toHaveAttribute("data-pane-active", "false");

  await output.click();
  await expectActiveBorder(output);
  await expect(explorer).toHaveAttribute("data-pane-active", "false");

  await editor.focus();
  await expect(editor).toBeFocused();
  await expectActiveBorder(editor);
  await expect(output).toHaveAttribute("data-pane-active", "false");
});
