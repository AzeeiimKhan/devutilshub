import {
  test,
  expect,
  open,
  click,
  clipboard,
  downloadText,
  token,
  tokenPayload,
} from "./support/fixtures";
import { exampleTests, clipboardFailureTest } from "./support/tool-cases";

test("JWT: decode, expiry/nbf, verification disclaimer, copy, download, invalid and clear", async ({
  page,
}) => {
  await open(page, "jwt-decoder");
  const input = page.getByLabel("JWT token input");
  await click(page, "Decode");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Enter a JWT before decoding",
  );
  await input.fill(token);
  await input.press("Control+Enter");
  await expect(page.getByRole("main")).toContainText("demo-🌍");
  await expect(page.getByRole("main")).toContainText("Expired");
  await expect(page.getByRole("main")).toContainText("Not active yet");
  await expect(page.getByRole("main")).toContainText("Signature not verified");
  await click(page, "Copy Payload");
  expect(JSON.parse(await clipboard(page))).toEqual(tokenPayload);
  const downloaded = await downloadText(
    page,
    page.getByRole("button", { name: /Download/, exact: false }).first(),
  );
  expect(JSON.parse(downloaded.text).signatureVerified).toBe(false);
  await input.fill("invalid.token");
  await click(page, "Decode");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "three dot-separated",
  );
  await expect(
    page.getByRole("button", { name: "Copy Payload", exact: true }),
  ).not.toBeAttached();
  await page.getByRole("button", { name: /Clear JWT/ }).click();
  await expect(input).toHaveValue("");
});

exampleTests("jwt-decoder");
clipboardFailureTest("jwt-decoder", "Copy all");
