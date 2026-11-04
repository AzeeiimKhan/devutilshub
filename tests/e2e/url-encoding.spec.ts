import { encodingTests } from "./support/tool-cases";

encodingTests({
  slug: "url-encode-decode",
  input: "URL component text input",
  output: "Percent-encoded output",
  reversedInput: "Percent-encoded text input",
  decodedOutput: "Decoded text output",
  clear: "Clear URL encoding input and output",
  encode: encodeURIComponent,
  invalid: "%GG",
  emptyDecodeMessage: "Enter percent-encoded text before decoding",
});
