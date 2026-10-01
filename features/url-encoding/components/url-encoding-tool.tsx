"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  CircleAlert,
  Clipboard,
  Download,
  Info,
  Link2,
  LockKeyhole,
  Percent,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolExamples } from "@/features/tool-engine/components/tool-examples";
import {
  ToolPanel,
  ToolToolbar,
  ToolWorkspace,
} from "@/features/tool-engine/components/tool-workspace";
import {
  transformUrlComponent,
  type UrlEncodingMode,
} from "@/features/url-encoding/lib/url-encoding";
import { cn } from "@/lib/utils";
import type { ToolExample, ToolMetadata } from "@/types/tool";

type Status = {
  tone: "success" | "error" | "info";
  message: string;
} | null;

function textStats(value: string) {
  return {
    lines: value.length === 0 ? 0 : value.split(/\r\n|\r|\n/).length,
    characters: value.length,
  };
}

function StatusNotice({ status }: { status: Status }) {
  if (!status) return null;

  const Icon =
    status.tone === "success"
      ? CheckCircle2
      : status.tone === "error"
        ? CircleAlert
        : Info;

  return (
    <div
      role={status.tone === "error" ? "alert" : "status"}
      aria-live="polite"
      className={cn(
        "border-border flex items-center gap-3 border-b px-4 py-3 text-sm sm:px-5",
        status.tone === "success" && "bg-success/8 text-success",
        status.tone === "error" && "bg-error/8 text-error",
        status.tone === "info" && "bg-primary/8 text-primary",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <p>{status.message}</p>
    </div>
  );
}

export function UrlEncodingTool({ tool }: { tool: ToolMetadata }) {
  const [mode, setMode] = useState<UrlEncodingMode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputStats = useMemo(() => textStats(input), [input]);
  const outputStats = useMemo(() => textStats(output), [output]);

  function runTransform(nextMode: UrlEncodingMode = mode) {
    setMode(nextMode);
    const result = transformUrlComponent(input, nextMode);

    if (!result.ok) {
      setOutput("");
      setStatus({ tone: "error", message: result.error });
      return;
    }

    setOutput(result.output);
    setStatus({
      tone: "success",
      message:
        nextMode === "encode"
          ? "URL component encoded successfully."
          : "Percent-encoded text decoded successfully.",
    });
  }

  function clear() {
    setInput("");
    setOutput("");
    setStatus(null);
    inputRef.current?.focus();
  }

  function swap() {
    if (!output) return;

    setInput(output);
    setOutput(input);
    setMode((current) => (current === "encode" ? "decode" : "encode"));
    setStatus({
      tone: "info",
      message: "Input and output swapped. The mode was reversed.",
    });
    inputRef.current?.focus();
  }

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setStatus({ tone: "info", message: "Output copied to the clipboard." });
    } catch {
      setStatus({
        tone: "error",
        message:
          "Clipboard access was unavailable. Select the output manually.",
      });
    }
  }

  function downloadOutput() {
    if (!output) return;

    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = mode === "encode" ? "encoded.txt" : "decoded.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    setStatus({ tone: "info", message: "Text download started." });
  }

  function selectExample(example: ToolExample) {
    const exampleMode = example.mode ?? "encode";
    setMode(exampleMode);
    setInput(example.input);
    setOutput("");
    setStatus({
      tone: "info",
      message: `Loaded the “${example.title}” ${exampleMode} example.`,
    });
    document
      .getElementById("tool-workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    inputRef.current?.focus({ preventScroll: true });
  }

  const toolbar = (
    <>
      <ToolToolbar>
        <div
          role="group"
          aria-label="URL encoding operation"
          className="flex items-center gap-2"
        >
          <Button
            size="sm"
            variant={mode === "encode" ? "default" : "secondary"}
            aria-pressed={mode === "encode"}
            onClick={() => runTransform("encode")}
          >
            <Percent aria-hidden="true" />
            Encode
          </Button>
          <Button
            size="sm"
            variant={mode === "decode" ? "default" : "secondary"}
            aria-pressed={mode === "decode"}
            onClick={() => runTransform("decode")}
          >
            <Link2 aria-hidden="true" />
            Decode
          </Button>
        </div>
        <span className="bg-border mx-1 h-6 w-px" aria-hidden="true" />
        <Button size="sm" variant="ghost" onClick={swap} disabled={!output}>
          <ArrowLeftRight aria-hidden="true" />
          Swap
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyOutput}
          disabled={!output}
        >
          <Clipboard aria-hidden="true" />
          Copy
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={downloadOutput}
          disabled={!output}
        >
          <Download aria-hidden="true" />
          Download
        </Button>
        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1.5 text-xs">
          <LockKeyhole className="text-primary size-3.5" aria-hidden="true" />
          Your data never leaves your browser
        </span>
      </ToolToolbar>
      <StatusNotice status={status} />
    </>
  );

  return (
    <>
      <aside className="border-warning/25 bg-warning/8 mt-8 flex items-start gap-3 rounded-xl border p-4 sm:p-5">
        <Info
          className="text-warning mt-0.5 size-5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-foreground font-medium">
            URL encoding is encoding, not encryption.
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            Percent encoding makes characters safe for a URL component, but
            provides no confidentiality, authentication, or password protection.
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Use this tool primarily for query parameter values, path pieces, and
            user-provided text. Encoding an entire URL is different because
            separators such as :, /, ?, and &amp; have structural meaning.
          </p>
        </div>
      </aside>

      <ToolWorkspace toolbar={toolbar}>
        <ToolPanel
          title={
            mode === "encode" ? "URL component input" : "Encoded component"
          }
          description={
            mode === "encode"
              ? "Plain text to percent-encode"
              : "Percent-encoded text to decode"
          }
          actions={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clear}
              disabled={!input && !output}
              aria-label="Clear URL encoding input and output"
            >
              <Trash2 aria-hidden="true" />
              Clear
            </Button>
          }
          footer={
            <span className="flex w-full items-center justify-between gap-4">
              <span>{inputStats.lines.toLocaleString()} lines</span>
              <span>{inputStats.characters.toLocaleString()} characters</span>
            </span>
          }
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setOutput("");
              setStatus(null);
            }}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                runTransform();
              }
            }}
            aria-label={
              mode === "encode"
                ? "URL component text input"
                : "Percent-encoded text input"
            }
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={
              mode === "encode"
                ? "Enter a URL component, such as a query parameter value."
                : "Paste percent-encoded text, such as hello%20world."
            }
            className="text-foreground placeholder:text-muted-foreground/65 focus-visible:ring-ring block min-h-80 w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-inset sm:p-5 lg:min-h-[32rem]"
          />
        </ToolPanel>

        <ToolPanel
          title={mode === "encode" ? "Encoded output" : "Decoded text"}
          description={
            mode === "encode"
              ? "encodeURIComponent result"
              : "decodeURIComponent result"
          }
          footer={
            <span className="flex w-full items-center justify-between gap-4">
              <span>{outputStats.lines.toLocaleString()} lines</span>
              <span>{outputStats.characters.toLocaleString()} characters</span>
            </span>
          }
        >
          <textarea
            value={output}
            readOnly
            aria-label={
              mode === "encode"
                ? "Percent-encoded output"
                : "Decoded text output"
            }
            spellCheck={false}
            placeholder="The result will appear here."
            className="bg-background/45 text-foreground placeholder:text-muted-foreground/65 focus-visible:ring-ring block min-h-80 w-full resize-y p-4 font-mono text-[13px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-inset sm:p-5 lg:min-h-[32rem]"
          />
        </ToolPanel>
      </ToolWorkspace>

      <ToolExamples examples={tool.examples} onSelect={selectExample} />
    </>
  );
}
