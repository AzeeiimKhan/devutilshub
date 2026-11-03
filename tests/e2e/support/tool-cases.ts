import { tools } from "../../../tools/registry";
import {
  test,
  expect,
  open,
  click,
  createResult,
  clipboard,
  downloadText,
} from "./fixtures";

export function encodingTests(encoding: {
  slug: string;
  input: string;
  output: string;
  reversedInput: string;
  decodedOutput: string;
  clear: string;
  encode: (text: string) => string;
  invalid: string;
  emptyDecodeMessage: string;
}) {
  test(`${encoding.slug}: Unicode, encode/decode, swap, shortcuts, clipboard, download, invalid input and clear`, async ({
    page,
  }) => {
    await open(page, encoding.slug);
    await click(page, "Encode");
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "Enter text before encoding",
    );
    await click(page, "Decode");
    await click(page, "Decode");
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      encoding.emptyDecodeMessage,
    );
    await click(page, "Encode");
    const text = "Café 🌍 + & /?\nhello";
    await page.getByLabel(encoding.input, { exact: true }).fill(text);
    await page
      .getByLabel(encoding.input, { exact: true })
      .press("Control+Enter");
    await expect(page.getByLabel(encoding.output, { exact: true })).toHaveValue(
      encoding.encode(text),
    );
    await click(page, "Copy");
    expect(await clipboard(page)).toBe(encoding.encode(text));
    const downloaded = await downloadText(
      page,
      page.getByRole("button", { name: "Download", exact: true }),
    );
    expect(downloaded.text).toBe(encoding.encode(text));
    await click(page, "Swap");
    await expect(
      page.getByLabel(encoding.reversedInput, { exact: true }),
    ).toHaveValue(encoding.encode(text));
    await click(page, "Decode");
    await expect(
      page.getByLabel(encoding.decodedOutput, { exact: true }),
    ).toHaveValue(text);
    await page
      .getByLabel(encoding.reversedInput, { exact: true })
      .fill(encoding.invalid);
    await click(page, "Decode");
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "Invalid",
    );
    await expect(
      page.getByLabel(encoding.decodedOutput, { exact: true }),
    ).toHaveValue("");
    await click(page, encoding.clear);
    await expect(
      page.getByLabel(encoding.reversedInput, { exact: true }),
    ).toHaveValue("");
  });

  exampleTests(encoding.slug);
  clipboardFailureTest(encoding.slug, "Copy");
}

export function exampleTests(slug: string) {
  const tool = tools.find((tool) => tool.slug === slug)!;
  test(`${tool.slug}: every example loads and executes`, async ({ page }) => {
    await open(page, tool.slug);
    const actions: Record<string, string> = {
      "json-formatter": "Format",
      "json-validator": "Validate",
      "json-compare": "Compare",
      "jwt-decoder": "Decode",
      "hash-generator": "Generate Hash",
    };
    for (const example of tool.examples) {
      await page
        .getByRole("button")
        .filter({ has: page.getByText(example.title, { exact: true }) })
        .click();
      const input = page
        .getByRole("region", { name: "Tool workspace", exact: true })
        .getByRole("textbox")
        .first();
      await expect(input).toHaveValue(example.input);
      await click(
        page,
        actions[tool.slug] ?? (example.mode === "decode" ? "Decode" : "Encode"),
      );
      const bad =
        example.kind === "invalid" ||
        example.id === "invalid" ||
        example.title.includes("invalid");
      if (bad)
        await expect(
          page.getByRole("main").getByRole("alert").first(),
        ).toBeVisible();
      else
        await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
    }
  });
}

export function clipboardFailureTest(slug: string, button: string) {
  test(`${slug}: clipboard denial produces useful feedback`, async ({
    page,
  }) => {
    await open(page, slug);
    await createResult(page, slug);
    await page.evaluate(() => {
      Object.defineProperty(navigator.clipboard, "writeText", {
        configurable: true,
        value: () => Promise.reject(new Error("Permission denied")),
      });
    });
    await click(page, button);
    await expect(
      page.getByRole("region", { name: "Tool workspace", exact: true }),
    ).toContainText(/Clipboard access was unavailable/);
  });
}
