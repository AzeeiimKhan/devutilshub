import fs from "node:fs/promises";
import {
  test as base,
  expect,
  type Page,
  type Locator,
} from "@playwright/test";

export const test = base.extend<{ runtimeChecks: void; expected404: boolean }>({
  expected404: [false, { option: true }],
  runtimeChecks: [
    async ({ page, expected404 }, use) => {
      const errors: string[] = [];
      const processingRequests: string[] = [];
      const externalRequests: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => {
        if (request.postData()) processingRequests.push(request.url());
        if (
          /^https?:/.test(request.url()) &&
          new URL(request.url()).origin !== "http://127.0.0.1:3100"
        ) {
          externalRequests.push(request.url());
        }
      });
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          !(
            expected404 &&
            /Failed to load resource:.*404/.test(message.text()) &&
            /^http:\/\/127\.0\.0\.1:3100\/(?:tools\/no-such-tool|no-such-page)$/.test(
              message.location().url,
            )
          )
        )
          errors.push(message.text());
      });
      await use();
      expect(errors, "Browser console and uncaught errors").toEqual([]);
      expect(
        processingRequests,
        "Tool inputs must not be submitted over the network",
      ).toEqual([]);
      expect(
        externalRequests,
        "Tests must stay independent of external services",
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export async function open(page: Page, slug?: string) {
  const response = await page.goto(slug ? `/tools/${slug}` : "/");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("button", { name: "Toggle color theme" }).first(),
  ).toBeAttached();
  await page.waitForFunction(
    () =>
      document.documentElement.classList.contains("dark") ||
      document.documentElement.classList.contains("light"),
  );
}

export async function createResult(page: Page, slug: string) {
  switch (slug) {
    case "json-formatter":
      await page.getByLabel("JSON input", { exact: true }).fill('{"a":1}');
      await click(page, "Format");
      break;
    case "json-validator":
      await page.getByLabel("JSON to validate").fill('{"a":1}');
      await click(page, "Validate");
      break;
    case "json-compare":
      await page.getByLabel("JSON A input").fill('{"a":1}');
      await page.getByLabel("JSON B input").fill('{"a":2}');
      await click(page, "Compare");
      break;
    case "base64":
      await page
        .getByLabel("Plain text input", { exact: true })
        .fill("Café 🌍");
      await click(page, "Encode");
      break;
    case "url-encode-decode":
      await page.getByLabel("URL component text input").fill("Café 🌍");
      await click(page, "Encode");
      break;
    case "jwt-decoder":
      await page.getByLabel("JWT token input").fill(token);
      await click(page, "Decode");
      break;
    case "uuid-generator":
      await click(page, "100");
      await click(page, "Generate UUIDs");
      break;
    case "timestamp-converter":
      await click(page, "Date to timestamp");
      await click(page, "UTC");
      await page
        .getByLabel("Date and time", { exact: true })
        .fill("2024-01-01T00:00:00.123");
      await click(page, "Convert");
      break;
    case "hash-generator":
      await page.getByLabel("Text to hash").fill("Café 🌍");
      await click(page, "Generate Hash");
      await expect(
        page.getByRole("status", { name: "Generated digest", exact: true }),
      ).toBeVisible();
      break;
  }
}

export async function click(page: Page, name: string) {
  await page.getByRole("button", { name, exact: true }).first().click();
}
export async function clipboard(page: Page) {
  // Windows normalizes clipboard line endings to CRLF.
  return (await page.evaluate(() => navigator.clipboard.readText())).replace(
    /\r\n/g,
    "\n",
  );
}
export async function downloadText(page: Page, button: Locator) {
  const event = page.waitForEvent("download");
  await button.click();
  const download = await event;
  const path = await download.path();
  expect(path).not.toBeNull();
  return {
    filename: download.suggestedFilename(),
    text: await fs.readFile(path!, "utf8"),
  };
}
export const tokenPayload = { sub: "demo-🌍", exp: 1, nbf: 4102444800 };
export const token = `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify(tokenPayload)).toString("base64url")}.c2ln`;

export { expect };
