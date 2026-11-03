import { test, expect, open, click, clipboard } from "./support/fixtures";
import { clipboardFailureTest } from "./support/tool-cases";

test("Timestamp: every supplied example and date field follow the selected theme", async ({
  page,
}) => {
  await open(page, "timestamp-converter");
  for (const title of [
    "Current time",
    "Unix epoch",
    "Recent timestamp",
    "Millisecond precision",
    "Before 1970",
  ]) {
    await page.getByRole("button").filter({ hasText: title }).last().click();
    await expect(page.locator("#tool-workspace output")).toHaveCount(5);
    await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
  }
  await click(page, "Date to timestamp");
  const input = page.getByLabel("Date and time", { exact: true });
  expect(
    await input.evaluate((element) => getComputedStyle(element).colorScheme),
  ).toBe("dark");
  await page
    .getByRole("button", { name: "Toggle color theme" })
    .filter({ visible: true })
    .click();
  expect(
    await input.evaluate((element) => getComputedStyle(element).colorScheme),
  ).toBe("light");
});

test("Timestamp: decimal seconds, milliseconds, UTC/local conversion, current time and copying", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2024-06-15T12:34:56.789Z"));
  await open(page, "timestamp-converter");
  const input = page.getByLabel("Timestamp value", { exact: true });
  await input.fill("1.001");
  await input.press("Control+Enter");
  await expect(
    page.getByRole("region", { name: "Tool workspace", exact: true }),
  ).toContainText("1970-01-01T00:00:01.001Z");
  await click(page, "Copy ISO 8601 (UTC)");
  expect(await clipboard(page)).toBe("1970-01-01T00:00:01.001Z");
  await click(page, "milliseconds");
  await input.fill("1704067200123");
  await click(page, "Convert");
  await expect(
    page.getByRole("region", { name: "Tool workspace", exact: true }),
  ).toContainText("2024-01-01T00:00:00.123Z");
  await input.fill("no");
  await click(page, "Convert");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "finite numeric",
  );
  await click(page, "Date to timestamp");
  await click(page, "UTC");
  await page
    .getByLabel("Date and time", { exact: true })
    .fill("2024-01-01T00:00:00.123");
  await click(page, "Convert");
  await expect(
    page.getByRole("region", { name: "Tool workspace", exact: true }),
  ).toContainText("1704067200123");
  await click(page, "Local time");
  await click(page, "Convert");
  await expect(
    page.getByRole("region", { name: "Tool workspace", exact: true }),
  ).toContainText("2023-12-31T18:30:00.123Z");
  await click(page, "Use current time");
  await expect(page.locator('div[role="status"]')).toContainText(
    "Current time loaded",
  );
  await expect(
    page.getByRole("status").filter({ hasText: "2024-06-15T12:34:56.789Z" }),
  ).toBeVisible();
});

clipboardFailureTest("timestamp-converter", "Copy ISO 8601 (UTC)");

for (const [value, unit, iso] of [
  ["0", "seconds", "1970-01-01T00:00:00.000Z"],
  ["-1", "seconds", "1969-12-31T23:59:59.000Z"],
  ["-1.001", "seconds", "1969-12-31T23:59:58.999Z"],
  ["1704067200.123", "seconds", "2024-01-01T00:00:00.123Z"],
  ["-1", "milliseconds", "1969-12-31T23:59:59.999Z"],
] as const) {
  test(`Timestamp: ${value} ${unit} preserves the instant`, async ({
    page,
  }) => {
    await open(page, "timestamp-converter");
    await click(page, unit);
    await page.getByLabel("Timestamp value", { exact: true }).fill(value);
    await click(page, "Convert");
    await expect(
      page.getByRole("status").filter({ hasText: iso }),
    ).toBeVisible();
  });
}

test("Timestamp rejects empty, out-of-range and unsupported precision values", async ({
  page,
}) => {
  await open(page, "timestamp-converter");
  const input = page.getByLabel("Timestamp value", { exact: true });
  for (const [value, error] of [
    ["", "Enter a Unix timestamp"],
    ["Infinity", "finite numeric"],
    ["1e100", "outside the range"],
    ["0.0001", "more precise than one millisecond"],
  ]) {
    await input.fill(value);
    await click(page, "Convert");
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      error,
    );
    await expect(
      page.getByRole("button", { name: "Copy ISO 8601 (UTC)", exact: true }),
    ).not.toBeAttached();
  }
  await click(page, "milliseconds");
  await input.fill("1.1");
  await click(page, "Convert");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "more precise than one millisecond",
  );
  await click(page, "Date to timestamp");
  await click(page, "Convert");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Choose a date and time",
  );
});
