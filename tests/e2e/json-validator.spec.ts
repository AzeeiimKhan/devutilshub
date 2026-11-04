import { test, expect, open, click, clipboard } from "./support/fixtures";
import { exampleTests, clipboardFailureTest } from "./support/tool-cases";

test("JSON validator: valid structure, primitive, invalid details, copy and clearing stale results", async ({
  page,
}) => {
  await open(page, "json-validator");
  const input = page.getByLabel("JSON to validate");
  await click(page, "Validate");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Enter JSON",
  );
  await input.fill('{"a":[{"b":true}]}');
  await input.press("Control+Enter");
  await expect(
    page.getByRole("region", { name: "Tool workspace", exact: true }),
  ).toContainText("VALID JSON");
  await expect(
    page.getByRole("region", { name: "Tool workspace", exact: true }),
  ).toContainText("Object");
  await click(page, "Copy");
  expect(JSON.parse(await clipboard(page))).toEqual({ a: [{ b: true }] });
  await input.fill("null");
  await expect(
    page.getByRole("region", { name: "Tool workspace", exact: true }),
  ).toContainText("Ready to validate");
  await click(page, "Validate");
  await expect(
    page.getByRole("region", { name: "Tool workspace", exact: true }),
  ).toContainText("Null");
  await input.fill('{"a":1,}');
  await click(page, "Validate");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "INVALID JSON",
  );
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    /Line 1/,
  );
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    /Column \d+/,
  );
  await click(page, "Copy");
  expect(await clipboard(page)).toMatch(/Invalid JSON/);
  await click(page, "Clear JSON input and validation result");
  await expect(input).toHaveValue("");
});

exampleTests("json-validator");
clipboardFailureTest("json-validator", "Copy");
