import {
  test,
  expect,
  open,
  click,
  clipboard,
  downloadText,
} from "./support/fixtures";
import { exampleTests, clipboardFailureTest } from "./support/tool-cases";

test("JSON formatter: format, minify, validate, shortcut, copy, download, private share and clear", async ({
  page,
}) => {
  await open(page, "json-formatter");
  const input = page.getByLabel("JSON input", { exact: true });
  const output = page.getByLabel("JSON output", { exact: true });
  await expect(
    page.getByRole("button", { name: "Copy", exact: true }),
  ).toBeDisabled();
  await click(page, "Format");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Enter JSON",
  );
  const source = '{"hello":"🌍","n":1,"a":[null,false]}';
  await input.fill(source);
  await input.press("Control+Enter");
  await expect(output).toHaveValue(JSON.stringify(JSON.parse(source), null, 2));
  await click(page, "Minify");
  await expect(output).toHaveValue(source);
  await click(page, "Validate");
  await expect(page.getByRole("status")).toContainText("Valid JSON");
  await click(page, "Copy");
  expect(await clipboard(page)).toBe(source);
  const downloaded = await downloadText(
    page,
    page.getByRole("button", { name: "Download", exact: true }),
  );
  expect(downloaded.filename).toBe("formatted.json");
  expect(downloaded.text).toBe(source);
  await click(page, "Share");
  expect(await clipboard(page)).toBe(
    "http://127.0.0.1:3100/tools/json-formatter",
  );
  await input.fill('{"a":1,}');
  await click(page, "Format");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Invalid JSON",
  );
  await expect(output).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Download", exact: true }),
  ).toBeDisabled();
  await click(page, "Clear JSON input and output");
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
});

exampleTests("json-formatter");
clipboardFailureTest("json-formatter", "Copy");
