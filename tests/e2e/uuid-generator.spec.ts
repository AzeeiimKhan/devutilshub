import {
  test,
  expect,
  open,
  click,
  clipboard,
  downloadText,
} from "./support/fixtures";
import { clipboardFailureTest } from "./support/tool-cases";

test("UUID handles missing browser randomness without crashing", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(crypto, "randomUUID", { value: undefined }),
  );
  await open(page, "uuid-generator");
  await click(page, "Generate UUIDs");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "UUID generation is unavailable",
  );
  await expect(page.locator("#tool-workspace ol code")).toHaveCount(0);
});
test("UUID: quantities, randomness, individual/all copy, download, shortcut and clear", async ({
  page,
}) => {
  await open(page, "uuid-generator");
  for (const quantity of [1, 10, 100]) {
    await click(page, String(quantity));
    await click(page, "Generate UUIDs");
    const values = await page
      .locator("#tool-workspace ol code")
      .allTextContents();
    expect(values).toHaveLength(quantity);
    expect(new Set(values).size).toBe(quantity);
    for (const value of values)
      expect(value).toMatch(
        /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/,
      );
  }
  const values = await page
    .locator("#tool-workspace ol code")
    .allTextContents();
  await click(page, "Copy UUID 1");
  expect(await clipboard(page)).toBe(values[0]);
  await click(page, "Copy all");
  expect(await clipboard(page)).toBe(values.join("\n"));
  const downloaded = await downloadText(
    page,
    page.getByRole("button", { name: "Download", exact: true }),
  );
  expect(downloaded.filename).toBe("uuids.txt");
  expect(downloaded.text).toBe(values.join("\n"));
  await click(page, "Clear");
  await expect(page.locator("#tool-workspace ol code")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Generate UUIDs", exact: true })
    .focus();
  await page.keyboard.press("Control+Enter");
  await expect(page.locator("#tool-workspace ol code")).toHaveCount(100);
});

clipboardFailureTest("uuid-generator", "Copy all");
