import { test, expect, open, click, clipboard } from "./support/fixtures";
import { exampleTests, clipboardFailureTest } from "./support/tool-cases";

test("JSON compare: differences, identical documents, swapping, invalid inputs, clipboard and clear", async ({
  page,
}) => {
  await open(page, "json-compare");
  const a = page.getByLabel("JSON A input");
  const b = page.getByLabel("JSON B input");
  await click(page, "Compare");
  await expect(
    page.getByRole("region", { name: "Fix invalid JSON" }),
  ).toContainText("Enter JSON");
  await a.fill('{"a":1,"gone":true}');
  await b.fill('{"a":2,"new":null}');
  await a.press("Control+Enter");
  await expect(page.locator("#comparison-result-title")).toHaveText(
    "Comparison result",
  );
  await click(page, "Copy result");
  const result = await clipboard(page);
  expect(result).toContain("3 differences");
  expect(result).toContain("1 added");
  expect(result).toContain("1 removed");
  expect(result).toContain("1 changed");
  expect(result).toContain("ADDED\nnew\n+ null");
  expect(result).toContain("REMOVED\ngone\n- true");
  expect(result).toContain("CHANGED\na\n1 → 2");
  const differences = page
    .getByRole("region", { name: "Comparison result", exact: true })
    .getByRole("listitem");
  await expect(differences).toHaveCount(3);
  await expect(differences.filter({ hasText: "Added" })).toContainText(
    "+ null",
  );
  await expect(differences.filter({ hasText: "Removed" })).toContainText(
    "- true",
  );
  await expect(differences.filter({ hasText: "Changed" })).toContainText("1");
  await expect(differences.filter({ hasText: "Changed" })).toContainText("2");
  await click(page, "Swap");
  await expect(a).toHaveValue('{"a":2,"new":null}');
  await expect(page.locator("#comparison-result-title")).not.toBeAttached();
  await b.fill('{ "new": null, "a": 2 }');
  await click(page, "Compare");
  await expect(page.locator("#comparison-result-title")).toContainText(
    "IDENTICAL",
  );
  await a.fill("{");
  await click(page, "Compare");
  await expect(page.locator("#comparison-result-title")).toContainText(
    "Fix invalid JSON",
  );
  await click(page, "Clear A");
  await click(page, "Clear B");
  await expect(a).toHaveValue("");
  await expect(b).toHaveValue("");
});

exampleTests("json-compare");
clipboardFailureTest("json-compare", "Copy result");
