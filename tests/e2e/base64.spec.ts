import { encodingTests } from "./support/tool-cases";

encodingTests({
  slug: "base64",
  input: "Plain text input",
  output: "Base64 output",
  reversedInput: "Base64 input",
  decodedOutput: "Decoded text output",
  clear: "Clear Base64 input and output",
  encode: (text: string) => Buffer.from(text).toString("base64"),
  invalid: "%%%",
  emptyDecodeMessage: "Enter Base64 text before decoding",
});
