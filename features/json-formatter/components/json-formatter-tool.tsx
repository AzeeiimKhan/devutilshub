"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CircleCheck,
  Clipboard,
  Download,
  Info,
  LockKeyhole,
  Share2,
  Shrink,
  Trash2,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolExamples } from "@/features/tool-engine/components/tool-examples";
import {
  ToolPanel,
  ToolToolbar,
  ToolWorkspace,
} from "@/features/tool-engine/components/tool-workspace";
import {
  parseJson,
  transformJson,
  type JsonErrorDetails,
} from "@/features/json-formatter/lib/json-processing";
import { cn } from "@/lib/utils";
import type { ToolExample, ToolMetadata } from "@/types/tool";

type Status = {
  tone: "success" | "error" | "info";
  message: string;
  details?: string;
} | null;

function textStats(value: string) {
  return {
    lines: value.length === 0 ? 0 : value.split(/\r\n|\r|\n/).length,
    characters: value.length,
  };
}

function errorStatus(error: JsonErrorDetails): Status {
  const location = [
    error.line ? `line ${error.line}` : null,
    error.column ? `column ${error.column}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    tone: "error",
    message: error.message,
    details: location || undefined,
  };
}

function StatusNotice({ status }: { status: Status }) {
  if (!status) return null;

  const Icon =
    status.tone === "success"
      ? CheckCircle2
      : status.tone === "error"
        ? AlertCircle
        : Info;

  return (
    <div
      role={status.tone === "error" ? "alert" : "status"}
      aria-live="polite"
      className={cn(
        "border-border flex items-start gap-3 border-b px-4 py-3 text-sm sm:px-5",
        status.tone === "success" && "bg-success/8 text-success",
        status.tone === "error" && "bg-error/8 text-error",
        status.tone === "info" && "bg-primary/8 text-primary",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        <span className="font-medium">{status.message}</span>
        {status.details ? (
          <span className="ml-2 font-mono text-xs opacity-85">
            {status.details}
          </span>
        ) : null}
      </p>
    </div>
  );
}

export function JsonFormatterTool({ tool }: { tool: ToolMetadata }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputStats = useMemo(() => textStats(input), [input]);
  const outputStats = useMemo(() => textStats(output), [output]);

  function runTransform(mode: "format" | "minify") {
    const result = transformJson(input, mode);

    if (!result.ok) {
      setStatus(errorStatus(result.error));
      return;
    }

    setOutput(result.output);
    setStatus({
      tone: "success",
      message:
        mode === "format"
          ? "JSON formatted successfully."
          : "JSON minified successfully.",
    });
  }

  function validate() {
    const result = parseJson(input);

    if (!result.ok) {
      setStatus(errorStatus(result.error));
      return;
    }

    setStatus({
      tone: "success",
      message: "Valid JSON. No syntax errors found.",
    });
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

    const blob = new Blob([output], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "formatted.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    setStatus({ tone: "info", message: "JSON download started." });
  }

  async function shareTool() {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;

    try {
      await navigator.clipboard.writeText(cleanUrl);
      setStatus({
        tone: "info",
        message: "Tool link copied. Your JSON was not included.",
      });
    } catch {
      setStatus({
        tone: "error",
        message: "Could not copy the tool link to the clipboard.",
      });
    }
  }

  function clearInput() {
    setInput("");
    setOutput("");
    setStatus(null);
    inputRef.current?.focus();
  }

  function selectExample(example: ToolExample) {
    setInput(example.input);
    setOutput("");
    setStatus({
      tone: "info",
      message: `Loaded the “${example.title}” example.`,
    });
    document
      .getElementById("tool-workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    inputRef.current?.focus({ preventScroll: true });
  }

  const toolbar = (
    <>
      <ToolToolbar>
        <Button size="sm" onClick={() => runTransform("format")}>
          <WandSparkles aria-hidden="true" />
          Format
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => runTransform("minify")}
        >
          <Shrink aria-hidden="true" />
          Minify
        </Button>
        <Button size="sm" variant="secondary" onClick={validate}>
          <CircleCheck aria-hidden="true" />
          Validate
        </Button>
        <span className="bg-border mx-1 h-6 w-px" aria-hidden="true" />
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
        <Button size="sm" variant="ghost" onClick={shareTool}>
          <Share2 aria-hidden="true" />
          Share
        </Button>
        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1.5 text-xs">
          <LockKeyhole className="text-primary size-3.5" aria-hidden="true" />
          Your JSON never leaves your browser
        </span>
      </ToolToolbar>
      <StatusNotice status={status} />
    </>
  );

  return (
    <>
      <ToolWorkspace toolbar={toolbar}>
        <ToolPanel
          title="Input"
          description="Paste or type JSON"
          actions={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearInput}
              disabled={!input && !output}
              aria-label="Clear JSON input and output"
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
              if (status?.tone === "error") setStatus(null);
            }}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                runTransform("format");
              }
            }}
            aria-label="JSON input"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={
              'Paste JSON here, for example:\n{"name":"DevUtilsHub"}'
            }
            className="text-foreground placeholder:text-muted-foreground/65 focus-visible:ring-ring block min-h-80 w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-inset sm:p-5 lg:min-h-[34rem]"
          />
        </ToolPanel>

        <ToolPanel
          title="Output"
          description="Formatted or minified result"
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
            aria-label="JSON output"
            spellCheck={false}
            placeholder="Your processed JSON will appear here."
            className="bg-background/45 text-foreground placeholder:text-muted-foreground/65 focus-visible:ring-ring block min-h-80 w-full resize-y p-4 font-mono text-[13px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-inset sm:p-5 lg:min-h-[34rem]"
          />
        </ToolPanel>
      </ToolWorkspace>

      <ToolExamples examples={tool.examples} onSelect={selectExample} />
    </>
  );
}
