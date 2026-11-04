import AxeBuilder from "@axe-core/playwright";
import { tools } from "../../tools/registry";
import { test, expect, open, createResult } from "./support/fixtures";

for (const tool of tools) {
  test(`${tool.slug}: mobile result layout and accessibility in both themes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await open(page, tool.slug);
    await createResult(page, tool.slug);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      "Results must fit on mobile",
    ).toBe(true);
    await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
    for (const theme of ["dark", "light"]) {
      if (theme === "light")
        await page
          .getByRole("button", { name: "Toggle color theme" })
          .filter({ visible: true })
          .click();
      await expect(page.locator("html")).toHaveClass(new RegExp(theme));
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
        `${theme} result accessibility`,
      ).toEqual([]);
    }
  });
}

const routes = [
  { slug: undefined, title: "Developer tools that never leave your browser." },
  ...tools,
];

for (const width of [390, 768, 1280]) {
  for (const route of routes) {
    test(`${route.slug ?? "homepage"}: ${width}px layout, accessibility, theme and navigation`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, route.slug);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        route.title,
      );
      expect(await page.title()).toContain("DevUtilsHub");
      const ids = await page
        .locator("[id]")
        .evaluateAll((elements) => elements.map((element) => element.id));
      expect(new Set(ids).size, "Unique element IDs").toBe(ids.length);
      const badAnchors = await page
        .locator('a[href^="#"]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute("href")!)
            .filter((href) => !document.getElementById(href.slice(1))),
        );
      expect(badAnchors, "In-page anchor targets").toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        "Page must not overflow horizontally",
      ).toBe(true);
      for (const theme of ["light", "dark"]) {
        await page.evaluate(
          (theme) => localStorage.setItem("theme", theme),
          theme,
        );
        await page.reload();
        await expect(page.locator("html")).toHaveClass(new RegExp(theme));
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        expect(
          results.violations.map((item) => ({
            id: item.id,
            impact: item.impact,
            nodes: item.nodes.map((node) => node.target),
          })),
          `${theme} accessibility`,
        ).toEqual([]);
        if (!route.slug && [390, 1280].includes(width)) {
          await testInfo.attach(`homepage-${width}-${theme}`, {
            body: await page.screenshot({ fullPage: true }),
            contentType: "image/png",
          });
        }
      }
      await page
        .getByRole("button", { name: "Toggle color theme" })
        .filter({ visible: true })
        .click();
      await expect(page.locator("html")).toHaveClass(/light/);
      await page.reload();
      await expect(page.locator("html")).toHaveClass(/light/);
      if (width < 768) await page.locator("header summary").click();
      const toolsLink = page
        .getByRole("navigation", {
          name: width < 768 ? "Mobile navigation" : "Primary navigation",
          exact: true,
        })
        .getByRole("link", { name: "Tools", exact: true });
      const toolsHref = await toolsLink.getAttribute("href");
      expect(toolsHref).toMatch(/^\/#[\w-]+$/);
      await toolsLink.click();
      await expect(page).toHaveURL(toolsHref!);
      await expect(page.locator(toolsHref!.slice(1))).toBeVisible();
      if (route.slug) {
        await open(page, route.slug);
        const categoryLink = page
          .locator("footer")
          .getByRole("link", { name: "Utilities", exact: true });
        const categoryHref = await categoryLink.getAttribute("href");
        expect(categoryHref).toMatch(/^\/#[\w-]+$/);
        await categoryLink.click();
        await expect(page).toHaveURL(categoryHref!);
        await expect(page.locator(categoryHref!.slice(1))).toBeVisible();
      }
    });
  }
}
