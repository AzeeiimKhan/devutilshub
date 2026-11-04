import { createHash } from "node:crypto";
import {
  test,
  expect,
  open,
  click,
  clipboard,
  downloadText,
} from "./support/fixtures";
import { exampleTests, clipboardFailureTest } from "./support/tool-cases";

test("Hash ignores an in-flight digest after editing the input", async ({
  page,
}) => {
  await open(page, "hash-generator");
  await page.evaluate(() => {
    const original = crypto.subtle.digest.bind(crypto.subtle);
    const state = window as typeof window & {
      finishHashTest?: () => Promise<void>;
    };
    crypto.subtle.digest = (algorithm, data) =>
      new Promise<ArrayBuffer>((resolve) => {
        state.finishHashTest = async () => {
          crypto.subtle.digest = original;
          resolve(await original(algorithm, data));
        };
      });
  });
  const input = page.getByLabel("Text to hash");
  await input.fill("first");
  await click(page, "Generate Hash");
  await page.waitForFunction(
    () =>
      typeof (window as typeof window & { finishHashTest?: unknown })
        .finishHashTest === "function",
  );
  await input.fill("second");
  await page.evaluate(async () => {
    await (
      window as typeof window & { finishHashTest: () => Promise<void> }
    ).finishHashTest();
  });
  await expect(
    page.getByRole("status", { name: "Generated digest", exact: true }),
  ).not.toBeAttached();
  await click(page, "Generate Hash");
  await expect(
    page.getByRole("status", { name: "Generated digest", exact: true }),
  ).toHaveText(createHash("sha256").update("second").digest("hex"));
});

test("Hash handles missing Web Crypto while keeping MD5 available", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(crypto, "subtle", { value: undefined }),
  );
  await open(page, "hash-generator");
  await page.getByLabel("Text to hash").fill("abc");
  await click(page, "Generate Hash");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Web Crypto is unavailable",
  );
  await click(page, "MD5");
  await click(page, "Generate Hash");
  await expect(
    page.getByRole("status", { name: "Generated digest", exact: true }),
  ).toHaveText("900150983cd24fb0d6963f7d28e17f72");
});

test("Hash: all algorithms, whitespace, stale results, clipboard, download, shortcut and clear", async ({
  page,
}) => {
  await open(page, "hash-generator");
  const input = page.getByLabel("Text to hash");
  for (const algorithm of ["SHA-256", "SHA-1", "MD5"]) {
    await click(page, algorithm);
    await input.fill("abc");
    await input.press("Control+Enter");
    const expected = {
      "SHA-256":
        "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
      "SHA-1": "a9993e364706816aba3e25717850c26c9cd0d89d",
      MD5: "900150983cd24fb0d6963f7d28e17f72",
    }[algorithm]!;
    await expect(
      page.getByRole("status", { name: "Generated digest", exact: true }),
    ).toHaveText(expected);
    await click(page, "Copy Hash");
    expect(await clipboard(page)).toBe(expected);
    const downloaded = await downloadText(
      page,
      page.getByRole("button", { name: "Download", exact: true }).first(),
    );
    expect(downloaded.filename).toBe("hash.txt");
    expect(downloaded.text).toBe(
      `Algorithm: ${algorithm}\nHash: ${expected}\n`,
    );
  }
  await input.fill(" ");
  await expect(
    page.getByRole("status", { name: "Generated digest", exact: true }),
  ).not.toBeAttached();
  await click(page, "Generate Hash");
  await expect(
    page.getByRole("status", { name: "Generated digest", exact: true }),
  ).toHaveText(createHash("md5").update(" ").digest("hex"));
  await click(page, "Clear hash input and result");
  await click(page, "Generate Hash");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Enter some text",
  );
});

exampleTests("hash-generator");
clipboardFailureTest("hash-generator", "Copy Hash");
