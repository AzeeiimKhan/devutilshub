import { test, expect } from "./support/fixtures";

test.use({ expected404: true });

test("Unknown tool and unknown page return 404 with recovery links", async ({
  page,
}) => {
  for (const path of ["/tools/no-such-tool", "/no-such-page"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page
      .getByRole("link", { name: "DevUtilsHub home", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL("/");
  }
});
