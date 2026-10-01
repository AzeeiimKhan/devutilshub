"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  CircleAlert,
  Clipboard,
  GitCompareArrows,
  LockKeyhole,
  Minus,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  compareJson,
  comparisonAsText,
  type JsonComparisonResult,
  type JsonDifference,
  type JsonValue,
} from "@/features/json-compare/lib/json-compare";
import type { JsonParseResult } from "@/features/json-formatter/lib/json-processing";
import { ToolExamples } from "@/features/tool-engine/components/tool-examples";
import {
  ToolPanel,
  ToolToolbar,
  ToolWorkspace,
} from "@/features/tool-engine/components/tool-workspace";
import { cn } from "@/lib/utils";
import type { ToolExample, ToolMetadata } from "@/types/tool";

function textStats(value: string) {
  return {
    lines: value.length === 0 ? 0 : value.split(/\r\n|\r|\n/).length,
    characters: value.length,
  };
}

function displayValue(value: JsonValue) {
  return JSON.stringify(value);
}

function JsonInput({
  label,
  value,
  onChange,
  onClear,
  onCompare,
  inputRef,
}: {
  label: "JSON A" | "JSON B";
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onCompare: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const stats = useMemo(() => textStats(value), [value]);

  return (
    <ToolPanel
      title={label}
      description={`Paste the ${label === "JSON A" ? "original" : "comparison"} document`}
      actions={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={!value}
          aria-label={`Clear ${label}`}
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            onCompare();
          }
        }}
        aria-label={`${label} input`}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={`Paste ${label} here, for example:\n{"name":"DevUtilsHub"}`}
        className="text-foreground placeholder:text-muted-foreground/65 focus-visible:ring-ring block min-h-80 w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-inset sm:p-5 lg:min-h-[30rem]"
      />
    </ToolPanel>
  );
}

function InputValidation({
  label,
  result,
}: {
  label: "JSON A" | "JSON B";
  result: JsonParseResult;
}) {
  const location = !result.ok
    ? [
        result.error.line ? `line ${result.error.line}` : null,
        result.error.column ? `column ${result.error.column}` : null,
        result.error.position !== undefined
          ? `position ${result.error.position}`
          : null,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <Card
      className={cn("p-5", result.ok ? "border-success/25" : "border-error/25")}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-foreground font-mono text-sm font-semibold">
          {label}
        </h3>
        <Badge
          variant="outline"
          className={
            result.ok
              ? "border-success/30 bg-success/8 text-success"
              : "border-error/30 bg-error/8 text-error"
          }
        >
          {result.ok ? "Valid" : "Invalid"}
        </Badge>
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-6">
        {result.ok ? "Ready for structural comparison." : result.error.message}
      </p>
      {location ? (
        <p className="text-error mt-3 font-mono text-xs">{location}</p>
      ) : null}
    </Card>
  );
}

const differenceStyles = {
  added: {
    label: "Added",
    icon: Plus,
    badge: "border-success/30 bg-success/8 text-success",
    border: "border-l-success",
  },
  removed: {
    label: "Removed",
    icon: Minus,
    badge: "border-error/30 bg-error/8 text-error",
    border: "border-l-error",
  },
  changed: {
    label: "Changed",
    icon: RefreshCw,
    badge: "border-warning/30 bg-warning/8 text-warning",
    border: "border-l-warning",
  },
} as const;

function DifferenceItem({ difference }: { difference: JsonDifference }) {
  const style = differenceStyles[difference.kind];
  const Icon = style.icon;

  return (
    <li>
      <Card className={cn("border-l-2 p-5", style.border)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <code className="text-foreground font-mono text-sm font-semibold break-all">
            {difference.path}
          </code>
          <Badge variant="outline" className={style.badge}>
            <Icon className="size-3" aria-hidden="true" />
            {style.label}
          </Badge>
        </div>

        {difference.kind === "added" ? (
          <code className="bg-success/6 text-success mt-4 block rounded-md px-3 py-2 font-mono text-xs leading-5 break-all whitespace-pre-wrap">
            + {displayValue(difference.after)}
          </code>
        ) : null}
        {difference.kind === "removed" ? (
          <code className="bg-error/6 text-error mt-4 block rounded-md px-3 py-2 font-mono text-xs leading-5 break-all whitespace-pre-wrap">
            - {displayValue(difference.before)}
          </code>
        ) : null}
        {difference.kind === "changed" ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <code className="bg-error/6 text-error rounded-md px-3 py-2 font-mono text-xs leading-5 break-all whitespace-pre-wrap">
              {displayValue(difference.before)}
            </code>
            <span
              className="text-muted-foreground hidden font-mono text-xs sm:block"
              aria-hidden="true"
            >
              →
            </span>
            <code className="bg-success/6 text-success rounded-md px-3 py-2 font-mono text-xs leading-5 break-all whitespace-pre-wrap">
              {displayValue(difference.after)}
            </code>
          </div>
        ) : null}
      </Card>
    </li>
  );
}

function ComparisonResult({ result }: { result: JsonComparisonResult }) {
  if (!result.ok) {
    return (
      <section
        className="mt-8"
        aria-labelledby="comparison-result-title"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <CircleAlert className="text-error size-5" aria-hidden="true" />
          <h2
            id="comparison-result-title"
            className="text-foreground text-xl font-semibold"
          >
            Fix invalid JSON before comparing
          </h2>
        </div>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Both documents must be valid. Your inputs have been left unchanged.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <InputValidation label="JSON A" result={result.inputA} />
          <InputValidation label="JSON B" result={result.inputB} />
        </div>
      </section>
    );
  }

  if (result.differences.length === 0) {
    return (
      <section
        className="border-success/25 bg-success/8 mt-8 rounded-xl border p-6"
        aria-labelledby="comparison-result-title"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="text-success mt-0.5 size-5"
            aria-hidden="true"
          />
          <div>
            <h2
              id="comparison-result-title"
              className="text-success font-mono text-sm font-semibold tracking-[0.1em]"
            >
              JSON DOCUMENTS ARE IDENTICAL
            </h2>
            <p className="text-foreground mt-2 text-sm leading-6">
              No structural differences were found. Formatting and object key
              order were ignored.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const counters = [
    ["Differences", result.summary.total],
    ["Added", result.summary.added],
    ["Removed", result.summary.removed],
    ["Changed", result.summary.changed],
    ["Unchanged values", result.summary.unchanged],
  ] as const;

  return (
    <section
      className="mt-8"
      aria-labelledby="comparison-result-title"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <GitCompareArrows className="text-primary size-5" aria-hidden="true" />
        <h2
          id="comparison-result-title"
          className="text-foreground text-xl font-semibold"
        >
          Comparison result
        </h2>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {counters.map(([label, count]) => (
          <div
            key={label}
            className="border-border bg-secondary/35 rounded-lg border p-3"
          >
            <dt className="text-muted-foreground text-[11px] uppercase">
              {label}
            </dt>
            <dd className="text-foreground mt-1 font-mono text-lg font-semibold">
              {count.toLocaleString()}
            </dd>
          </div>
        ))}
      </dl>
      <ol className="mt-5 max-h-[48rem] space-y-3 overflow-y-auto pr-1">
        {result.differences.map((difference, index) => (
          <DifferenceItem
            key={`${difference.kind}-${difference.path}-${index}`}
            difference={difference}
          />
        ))}
      </ol>
      <p className="text-muted-foreground mt-4 text-xs leading-5">
        Arrays are compared by index. Added, removed, and changed labels are
        provided in addition to color.
      </p>
    </section>
  );
}

export function JsonCompareTool({ tool }: { tool: ToolMetadata }) {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [result, setResult] = useState<JsonComparisonResult | null>(null);
  const [notice, setNotice] = useState("");
  const inputARef = useRef<HTMLTextAreaElement>(null);
  const inputBRef = useRef<HTMLTextAreaElement>(null);

  function updateInput(
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) {
    setter(value);
    setResult(null);
    setNotice("");
  }

  function runComparison() {
    setResult(compareJson(inputA, inputB));
    setNotice("");
  }

  function clearInput(which: "a" | "b") {
    if (which === "a") {
      setInputA("");
      inputARef.current?.focus();
    } else {
      setInputB("");
      inputBRef.current?.focus();
    }

    setResult(null);
    setNotice("");
  }

  function swapInputs() {
    setInputA(inputB);
    setInputB(inputA);
    setResult(null);
    setNotice("JSON A and JSON B were swapped.");
  }

  async function copyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(comparisonAsText(result));
      setNotice("Comparison result copied to the clipboard.");
    } catch {
      setNotice("Clipboard access was unavailable.");
    }
  }

  function selectExample(example: ToolExample) {
    setInputA(example.input);
    setInputB(example.secondaryInput ?? "");
    setResult(null);
    setNotice(`Loaded the “${example.title}” example.`);
    document
      .getElementById("tool-workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    inputARef.current?.focus({ preventScroll: true });
  }

  const toolbar = (
    <>
      <ToolToolbar>
        <Button size="sm" onClick={runComparison}>
          <GitCompareArrows aria-hidden="true" />
          Compare
        </Button>
        <Button size="sm" variant="secondary" onClick={swapInputs}>
          <ArrowLeftRight aria-hidden="true" />
          Swap
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => clearInput("a")}
          disabled={!inputA}
        >
          <Trash2 aria-hidden="true" />
          Clear A
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => clearInput("b")}
          disabled={!inputB}
        >
          <Trash2 aria-hidden="true" />
          Clear B
        </Button>
        <span className="bg-border mx-1 h-6 w-px" aria-hidden="true" />
        <Button
          size="sm"
          variant="ghost"
          onClick={copyResult}
          disabled={!result}
        >
          <Clipboard aria-hidden="true" />
          Copy result
        </Button>
        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1.5 text-xs">
          <LockKeyhole className="text-primary size-3.5" aria-hidden="true" />
          Your JSON never leaves your browser
        </span>
      </ToolToolbar>
      {notice ? (
        <p
          role="status"
          aria-live="polite"
          className="border-border bg-primary/8 text-primary border-b px-4 py-3 text-sm sm:px-5"
        >
          {notice}
        </p>
      ) : null}
    </>
  );

  return (
    <>
      <ToolWorkspace toolbar={toolbar}>
        <JsonInput
          label="JSON A"
          value={inputA}
          onChange={(value) => updateInput(setInputA, value)}
          onClear={() => clearInput("a")}
          onCompare={runComparison}
          inputRef={inputARef}
        />
        <JsonInput
          label="JSON B"
          value={inputB}
          onChange={(value) => updateInput(setInputB, value)}
          onClear={() => clearInput("b")}
          onCompare={runComparison}
          inputRef={inputBRef}
        />
      </ToolWorkspace>

      {result ? <ComparisonResult result={result} /> : null}

      <ToolExamples examples={tool.examples} onSelect={selectExample} />
    </>
  );
}
