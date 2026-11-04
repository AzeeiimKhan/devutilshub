import AxeBuilder from "@axe-core/playwright";
import { categories } from "../../metadata/categories";
import { tools } from "../../tools/registry";
import { test, expect, open } from "./support/fixtures";

test("Search expanded results are accessible, arrows wrap and Tab can leave", async ({
  page,
}) => {
  await open(page);
  const input = page.locator("#tool-search");
  await input.fill("json");
  await input.press("ArrowUp");
  const options = page.getByRole("listbox").getByRole("option");
  await expect(options.last()).toHaveAttribute("aria-selected", "true");
  await input.press("ArrowDown");
  await expect(options.first()).toHaveAttribute("aria-selected", "true");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await input.fill("no-match-123");
  const emptyResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(emptyResults.violations.map((item) => item.id)).toEqual([]);
  await input.press("Tab");
  await expect(input).not.toBeFocused();
});
test("Homepage: featured tool links, category targets, popular tools and FAQ", async ({
  page,
}) => {
  await open(page);
  const featured = tools.filter(
    (tool) => tool.featured && tool.availability === "available",
  );
  await expect(page.locator("#featured-tools").getByRole("link")).toHaveCount(
    featured.length,
  );
  await expect(
    page.locator("#popular-tools").getByRole("heading", { level: 3 }),
  ).toHaveText(tools.filter((tool) => tool.popular).map((tool) => tool.title));
  for (const tool of featured) {
    await page
      .locator("#featured-tools")
      .getByRole("link")
      .filter({ has: page.locator(`#tool-${tool.slug}`) })
      .click();
    await expect(page).toHaveURL(`/tools/${tool.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      tool.title,
    );
    await page.goBack();
    await expect(page.locator("#featured-tools")).toBeAttached();
  }
  for (const category of categories) {
    await expect(page.locator(`#category-${category.id}`)).toContainText(
      category.title,
    );
    const link = page
      .locator("footer")
      .getByRole("link", { name: category.title, exact: true });
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^\/#[\w-]+$/);
    await link.click();
    await expect(page).toHaveURL(href!);
    await expect(page.locator(href!.slice(1))).toBeVisible();
  }
  const questions = page.locator("#faq details");
  await expect(questions).toHaveCount(4);
  for (const question of await questions.all()) {
    await question.locator("summary").click();
    await expect(question.locator("p")).toBeVisible();
    await question.locator("summary").click();
    await expect(question.locator("p")).not.toBeVisible();
  }
});

test("Search: title, keyword, no matches, Escape and keyboard selection", async ({
  page,
}) => {
  await open(page);
  const input = page.locator("#tool-search");
  for (const tool of tools) {
    await input.fill(tool.title);
    await page
      .locator("#tool-search-results-panel")
      .getByRole("option")
      .filter({ hasText: tool.title })
      .click();
    await expect(page).toHaveURL(`/tools/${tool.slug}`);
    await open(page);
  }
  await input.fill("sha256");
  await expect(page.locator("#tool-search-results-panel")).toContainText(
    "Hash Generator",
  );
  await input.press("Escape");
  await expect(page.locator("#tool-search-results-panel")).not.toBeVisible();
  await input.fill("no-such-tool-123");
  await expect(page.locator("#tool-search-results-panel")).toContainText(
    "No tools match",
  );
  await input.fill("UUID");
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(page).toHaveURL("/tools/uuid-generator");
});
