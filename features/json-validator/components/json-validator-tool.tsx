"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  Braces,
  CheckCircle2,
  CircleAlert,
  Clipboard,
  ExternalLink,
  LockKeyhole,
  ShieldCheck,
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
  validateJson,
  type JsonValidationResult,
} from "@/features/json-validator/lib/json-validation";
import type { ToolExample, ToolMetadata } from "@/types/tool";

function textStats(value: string) {
  return {
    lines: value.length === 0 ? 0 : value.split(/\r\n|\r|\n/).length,
    characters: value.length,
  };
}

function copyText(result: JsonValidationResult) {
  if (result.ok) return result.preview;

  const location = [
    result.error.line ? `Line ${result.error.line}` : null,
    result.error.column ? `column ${result.error.column}` : null,
    result.error.position !== undefined
      ? `position ${result.error.position}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  return [result.error.message, location].filter(Boolean).join("\n");
}

function EmptyResult() {
  return (
    <div className="text-muted-foreground flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center lg:min-h-[34rem]">
      <span className="border-border bg-secondary flex size-11 items-center justify-center rounded-xl border">
        <Braces className="size-5" aria-hidden="true" />
      </span>
      <p className="text-foreground mt-4 text-sm font-medium">
        Ready to validate
      </p>
      <p className="mt-2 max-w-xs text-xs leading-5">
        Enter JSON and select Validate, or press Ctrl/Command + Enter.
      </p>
    </div>
  );
}

function ValidationResult({ result }: { result: JsonValidationResult }) {
  if (!result.ok) {
    const location = [
      result.error.line ? `Line ${result.error.line}` : null,
      result.error.column ? `Column ${result.error.column}` : null,
      result.error.position !== undefined
        ? `Position ${result.error.position}`
        : null,
    ].filter(Boolean);

    return (
      <div role="alert" className="min-h-80 p-5 sm:p-6 lg:min-h-[34rem]">
        <div className="border-error/25 bg-error/8 rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <CircleAlert className="text-error size-5" aria-hidden="true" />
            <p className="text-error font-mono text-xs font-semibold tracking-[0.12em]">
              INVALID JSON
            </p>
          </div>
          <p className="text-foreground mt-4 text-sm leading-6">
            {result.error.message}
          </p>
          {location.length > 0 ? (
            <dl className="mt-5 flex flex-wrap gap-2">
              {location.map((detail) => (
                <div
                  key={detail}
                  className="border-border bg-background rounded-md border px-3 py-2"
                >
                  <dt className="sr-only">Error location</dt>
                  <dd className="text-muted-foreground font-mono text-xs">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-muted-foreground mt-4 text-xs leading-5">
              The browser did not provide a reliable error location.
            </p>
          )}
        </div>
      </div>
    );
  }

  const { structure } = result;

  return (
    <div role="status" className="min-h-80 p-5 sm:p-6 lg:min-h-[34rem]">
      <div className="border-success/25 bg-success/8 rounded-xl border p-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-success size-5" aria-hidden="true" />
          <p className="text-success font-mono text-xs font-semibold tracking-[0.12em]">
            VALID JSON
          </p>
        </div>
        <p className="text-foreground mt-4 text-sm leading-6">
          No JSON syntax errors were found.
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="border-border bg-secondary/35 rounded-lg border p-3">
          <dt className="text-muted-foreground text-[11px] uppercase">Root</dt>
          <dd className="text-foreground mt-1 font-mono text-sm">
            {structure.rootType}
          </dd>
        </div>
        {structure.entries !== null ? (
          <div className="border-border bg-secondary/35 rounded-lg border p-3">
            <dt className="text-muted-foreground text-[11px] uppercase">
              {structure.entryLabel}
            </dt>
            <dd className="text-foreground mt-1 font-mono text-sm">
              {structure.entries.toLocaleString()}
            </dd>
          </div>
        ) : null}
        <div className="border-border bg-secondary/35 rounded-lg border p-3">
          <dt className="text-muted-foreground text-[11px] uppercase">Depth</dt>
          <dd className="text-foreground mt-1 font-mono text-sm">
            {structure.depth.toLocaleString()}
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="text-muted-foreground mb-2 font-mono text-[11px] uppercase">
          Parsed preview
        </p>
        <pre className="border-border bg-background text-foreground max-h-72 overflow-auto rounded-lg border p-4 font-mono text-xs leading-5 whitespace-pre">
          {result.preview}
        </pre>
      </div>
    </div>
  );
}

export function JsonValidatorTool({ tool }: { tool: ToolMetadata }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JsonValidationResult | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stats = useMemo(() => textStats(input), [input]);

  function runValidation() {
    setResult(validateJson(input));
    setCopyMessage("");
  }

  function clearInput() {
    setInput("");
    setResult(null);
    setCopyMessage("");
    inputRef.current?.focus();
  }

  async function copyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(copyText(result));
      setCopyMessage(result.ok ? "Preview copied." : "Error details copied.");
    } catch {
      setCopyMessage("Clipboard access was unavailable.");
    }
  }

  function selectExample(example: ToolExample) {
    setInput(example.input);
    setResult(null);
    setCopyMessage(
      `${example.kind === "invalid" ? "Invalid" : "Valid"} example loaded.`,
    );
    document
      .getElementById("tool-workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    inputRef.current?.focus({ preventScroll: true });
  }

  const toolbar = (
    <>
      <ToolToolbar>
        <Button size="sm" onClick={runValidation}>
          <ShieldCheck aria-hidden="true" />
          Validate
        </Button>
        <Button size="sm" variant="secondary" asChild>
          <Link href="/tools/json-formatter">
            <ExternalLink aria-hidden="true" />
            Format
          </Link>
        </Button>
        <span className="bg-border mx-1 h-6 w-px" aria-hidden="true" />
        <Button
          size="sm"
          variant="ghost"
          onClick={copyResult}
          disabled={!result}
        >
          <Clipboard aria-hidden="true" />
          Copy
        </Button>
        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1.5 text-xs">
          <LockKeyhole className="text-primary size-3.5" aria-hidden="true" />
          Your JSON never leaves your browser
        </span>
      </ToolToolbar>
      {copyMessage ? (
        <p
          role="status"
          aria-live="polite"
          className="border-border bg-primary/8 text-primary border-b px-4 py-3 text-sm sm:px-5"
        >
          {copyMessage}
        </p>
      ) : null}
    </>
  );

  return (
    <>
      <ToolWorkspace toolbar={toolbar}>
        <ToolPanel
          title="JSON input"
          description="Paste or type JSON to check"
          actions={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearInput}
              disabled={!input && !result}
              aria-label="Clear JSON input and validation result"
            >
              <Trash2 aria-hidden="true" />
              Clear
            </Button>
          }
          footer={
            <span className="flex w-full items-center justify-between gap-4">
              <span>{stats.lines.toLocaleString()} lines</span>
              <span>{stats.characters.toLocaleString()} characters</span>
            </span>
          }
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setResult(null);
              setCopyMessage("");
            }}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                runValidation();
              }
            }}
            aria-label="JSON to validate"
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
          title="Validation result"
          description="Syntax status and structure details"
          footer={
            <span>
              {result
                ? result.ok
                  ? "Parsed locally with JSON.parse"
                  : "Input preserved for correction"
                : "Waiting for input"}
            </span>
          }
        >
          {result ? <ValidationResult result={result} /> : <EmptyResult />}
        </ToolPanel>
      </ToolWorkspace>

      <ToolExamples examples={tool.examples} onSelect={selectExample} />
    </>
  );
}
