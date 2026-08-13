import { defineConfig, devices } from "@playwright/test";

const browserExecutable = process.env.PLAYWRIGHT_BROWSER_EXECUTABLE;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const serverURL = new URL(baseURL);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL,
    launchOptions: browserExecutable
      ? { executablePath: browserExecutable }
      : undefined,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run start",
    env: { HOSTNAME: serverURL.hostname, PORT: serverURL.port || "3000" },
    url: new URL("/en", baseURL).toString(),
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
