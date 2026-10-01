"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Copy,
  Info,
  LockKeyhole,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  dateInputToTimestamp,
  formatLocalDate,
  formatUtcDate,
  getBrowserTimezone,
  timestampToDate,
  toDateTimeInputValue,
  type DateInputTimezone,
  type TimestampConversion,
  type TimestampUnit,
} from "@/features/timestamp-converter/lib/timestamp-converter";
import {
  ToolPanel,
  ToolToolbar,
  ToolWorkspace,
} from "@/features/tool-engine/components/tool-workspace";
import { cn } from "@/lib/utils";

type ConversionMode = "timestamp-to-date" | "date-to-timestamp";
type Status = {
  tone: "success" | "error" | "info";
  message: string;
} | null;

const examples: Array<{
  id: string;
  title: string;
  description: string;
  unit: TimestampUnit;
  value: string | "current";
}> = [
  {
    id: "current",
    title: "Current time",
    description: "The current instant from your browser clock.",
    unit: "milliseconds",
    value: "current",
  },
  {
    id: "epoch",
    title: "Unix epoch",
    description: "0 seconds is 1970-01-01T00:00:00Z.",
    unit: "seconds",
    value: "0",
  },
  {
    id: "recent",
    title: "Recent timestamp",
    description: "The first instant of 2024 in UTC.",
    unit: "seconds",
    value: "1704067200",
  },
  {
    id: "milliseconds",
    title: "Millisecond precision",
    description: "A timestamp with 123 milliseconds preserved.",
    unit: "milliseconds",
    value: "1704067200123",
  },
  {
    id: "negative",
    title: "Before 1970",
    description: "Negative timestamps represent pre-epoch instants.",
    unit: "seconds",
    value: "-1",
  },
];

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

function OutputRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="border-border bg-background/35 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-medium">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-mr-2 h-8"
          onClick={onCopy}
          aria-label={`Copy ${label}`}
        >
          <Copy aria-hidden="true" />
          <span className="hidden sm:inline">Copy</span>
        </Button>
      </div>
      <output className="text-foreground mt-2 block min-w-0 font-mono text-xs leading-5 break-all sm:text-sm">
        {value}
      </output>
    </div>
  );
}

export function TimestampConverterTool() {
  const [mode, setMode] = useState<ConversionMode>("timestamp-to-date");
  const [timestampInput, setTimestampInput] = useState("");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [dateInput, setDateInput] = useState("");
  const [dateTimezone, setDateTimezone] = useState<DateInputTimezone>("local");
  const [browserTimezone, setBrowserTimezone] = useState("Local timezone");
  const [result, setResult] = useState<TimestampConversion | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const timestampInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setBrowserTimezone(getBrowserTimezone()), []);

  function convert() {
    const conversion =
      mode === "timestamp-to-date"
        ? timestampToDate(timestampInput, unit)
        : dateInputToTimestamp(dateInput, dateTimezone);

    if (!conversion.ok) {
      setResult(null);
      setStatus({ tone: "error", message: conversion.error });
      return;
    }

    setResult(conversion.value);
    setStatus({
      tone: "success",
      message:
        mode === "timestamp-to-date"
          ? `Timestamp converted as ${unit}.`
          : `Date interpreted as ${dateTimezone === "utc" ? "UTC" : `local time (${browserTimezone})`}.`,
    });
  }

  function changeMode(nextMode: ConversionMode) {
    setMode(nextMode);
    setResult(null);
    setStatus(null);
    window.setTimeout(() => {
      if (nextMode === "timestamp-to-date") timestampInputRef.current?.focus();
      else dateInputRef.current?.focus();
    });
  }

  function useCurrentTime() {
    const now = new Date();
    if (mode === "timestamp-to-date") {
      const value =
        unit === "seconds"
          ? (now.getTime() / 1_000).toFixed(3)
          : String(now.getTime());
      setTimestampInput(value);
      const conversion = timestampToDate(value, unit);
      if (conversion.ok) setResult(conversion.value);
    } else {
      const value = toDateTimeInputValue(now, dateTimezone);
      setDateInput(value);
      const conversion = dateInputToTimestamp(value, dateTimezone);
      if (conversion.ok) setResult(conversion.value);
    }
    setStatus({
      tone: "info",
      message: "Current time loaded from this browser's clock.",
    });
  }

  async function copyValue(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus({ tone: "info", message: `${label} copied to the clipboard.` });
    } catch {
      setStatus({
        tone: "error",
        message: "Clipboard access was unavailable. Select the value manually.",
      });
    }
  }

  function selectExample(example: (typeof examples)[number]) {
    const value =
      example.value === "current" ? String(Date.now()) : example.value;
    setMode("timestamp-to-date");
    setUnit(example.unit);
    setTimestampInput(value);
    const conversion = timestampToDate(value, example.unit);
    setResult(conversion.ok ? conversion.value : null);
    setStatus({
      tone: "info",
      message: `Loaded the ${example.title} example.`,
    });
    document
      .getElementById("tool-workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const localOutput = result ? formatLocalDate(result.date) : "";
  const utcOutput = result ? formatUtcDate(result.date) : "";
  const secondsOutput = result ? String(result.seconds) : "";
  const millisecondsOutput = result ? String(result.milliseconds) : "";

  const toolbar = (
    <>
      <ToolToolbar>
        <div
          role="group"
          aria-label="Conversion mode"
          className="flex items-center gap-2"
        >
          <Button
            size="sm"
            variant={mode === "timestamp-to-date" ? "default" : "secondary"}
            aria-pressed={mode === "timestamp-to-date"}
            onClick={() => changeMode("timestamp-to-date")}
          >
            <Clock3 aria-hidden="true" />
            Timestamp to date
          </Button>
          <Button
            size="sm"
            variant={mode === "date-to-timestamp" ? "default" : "secondary"}
            aria-pressed={mode === "date-to-timestamp"}
            onClick={() => changeMode("date-to-timestamp")}
          >
            <CalendarClock aria-hidden="true" />
            Date to timestamp
          </Button>
        </div>
        <span className="bg-border mx-1 h-6 w-px" aria-hidden="true" />
        <Button
          size="sm"
          variant="ghost"
          onClick={convert}
          aria-keyshortcuts="Control+Enter Meta+Enter"
        >
          <ArrowLeftRight aria-hidden="true" />
          Convert
        </Button>
        <Button size="sm" variant="ghost" onClick={useCurrentTime}>
          <RefreshCw aria-hidden="true" />
          Use current time
        </Button>
        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1.5 text-xs">
          <LockKeyhole className="text-primary size-3.5" aria-hidden="true" />
          Conversion stays in your browser
        </span>
      </ToolToolbar>
      <StatusNotice status={status} />
    </>
  );

  return (
    <div
      onKeyDown={(event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          event.preventDefault();
          convert();
        }
      }}
    >
      <aside className="border-primary/25 bg-primary/8 mt-8 flex items-start gap-3 rounded-xl border p-4 sm:p-5">
        <Info
          className="text-primary mt-0.5 size-5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-foreground font-medium">
            A Unix timestamp identifies an instant, not a timezone.
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            It measures elapsed time from 1970-01-01T00:00:00Z. UTC and local
            views describe the same instant using different clocks.
          </p>
        </div>
      </aside>

      <ToolWorkspace toolbar={toolbar}>
        <ToolPanel
          title={
            mode === "timestamp-to-date" ? "Unix timestamp" : "Date and time"
          }
          description={
            mode === "timestamp-to-date"
              ? "Enter a number and explicitly choose its unit"
              : "Choose a wall-clock time and how it should be interpreted"
          }
          footer={
            <span>
              {mode === "timestamp-to-date"
                ? `Unit: ${unit}`
                : `Input timezone: ${dateTimezone === "utc" ? "UTC" : browserTimezone}`}
            </span>
          }
        >
          <div className="flex min-h-80 flex-col p-5 sm:p-6 lg:min-h-[32rem]">
            {mode === "timestamp-to-date" ? (
              <>
                <label
                  htmlFor="timestamp-input"
                  className="text-foreground font-mono text-sm font-semibold"
                >
                  Timestamp value
                </label>
                <input
                  ref={timestampInputRef}
                  id="timestamp-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={timestampInput}
                  onChange={(event) => {
                    setTimestampInput(event.target.value);
                    setResult(null);
                    setStatus(null);
                  }}
                  placeholder="1704067200"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground/65 focus-visible:ring-ring mt-3 h-12 w-full rounded-lg border px-4 font-mono text-sm outline-none focus-visible:ring-2"
                />
                <fieldset className="mt-6">
                  <legend className="text-foreground font-mono text-sm font-semibold">
                    Timestamp unit
                  </legend>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {(["seconds", "milliseconds"] as const).map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={unit === value ? "default" : "secondary"}
                        className="h-11 capitalize"
                        aria-pressed={unit === value}
                        onClick={() => {
                          setUnit(value);
                          setResult(null);
                          setStatus(null);
                        }}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </fieldset>
                <p className="text-muted-foreground mt-4 text-xs leading-5">
                  The unit is never inferred from the number. Decimal seconds
                  are supported and preserve millisecond precision.
                </p>
              </>
            ) : (
              <>
                <label
                  htmlFor="date-input"
                  className="text-foreground font-mono text-sm font-semibold"
                >
                  Date and time
                </label>
                <input
                  ref={dateInputRef}
                  id="date-input"
                  type="datetime-local"
                  step="0.001"
                  value={dateInput}
                  onChange={(event) => {
                    setDateInput(event.target.value);
                    setResult(null);
                    setStatus(null);
                  }}
                  className="border-input bg-background text-foreground focus-visible:ring-ring mt-3 h-12 w-full min-w-0 rounded-lg border px-3 font-mono text-xs [color-scheme:dark] outline-none focus-visible:ring-2 sm:px-4 sm:text-sm"
                />
                <fieldset className="mt-6">
                  <legend className="text-foreground font-mono text-sm font-semibold">
                    Interpret as
                  </legend>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {(["local", "utc"] as const).map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={
                          dateTimezone === value ? "default" : "secondary"
                        }
                        className="h-11"
                        aria-pressed={dateTimezone === value}
                        onClick={() => {
                          setDateTimezone(value);
                          setResult(null);
                          setStatus(null);
                        }}
                      >
                        {value === "local" ? "Local time" : "UTC"}
                      </Button>
                    ))}
                  </div>
                </fieldset>
                <p className="text-muted-foreground mt-4 text-xs leading-5">
                  Local time uses {browserTimezone}. Changing this setting
                  changes how the wall-clock input is interpreted.
                </p>
              </>
            )}

            <Button size="lg" className="mt-8 w-full" onClick={convert}>
              <ArrowLeftRight aria-hidden="true" />
              Convert
            </Button>
          </div>
        </ToolPanel>

        <ToolPanel
          title="Conversion result"
          description="The same instant in useful representations"
          footer={<span>Browser timezone: {browserTimezone}</span>}
        >
          {result ? (
            <div className="max-h-[32rem] min-h-80 space-y-3 overflow-y-auto p-4 sm:p-5 lg:min-h-[32rem]">
              <OutputRow
                label="ISO 8601 (UTC)"
                value={result.iso}
                onCopy={() => copyValue("ISO value", result.iso)}
              />
              <OutputRow
                label="UTC"
                value={utcOutput}
                onCopy={() => copyValue("UTC value", utcOutput)}
              />
              <OutputRow
                label={`Local (${browserTimezone})`}
                value={localOutput}
                onCopy={() => copyValue("Local value", localOutput)}
              />
              <OutputRow
                label="Unix seconds"
                value={secondsOutput}
                onCopy={() => copyValue("Unix seconds", secondsOutput)}
              />
              <OutputRow
                label="Unix milliseconds"
                value={millisecondsOutput}
                onCopy={() =>
                  copyValue("Unix milliseconds", millisecondsOutput)
                }
              />
              {!Number.isInteger(result.seconds) ? (
                <p className="text-muted-foreground px-1 text-xs leading-5">
                  Fractional Unix seconds retain the millisecond component; the
                  digits after the decimal are fractions of one second.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="text-muted-foreground flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center lg:min-h-[32rem]">
              <span className="border-border bg-secondary flex size-11 items-center justify-center rounded-xl border">
                <Clock3 className="size-5" aria-hidden="true" />
              </span>
              <p className="text-foreground mt-4 text-sm font-medium">
                Ready to convert
              </p>
              <p className="mt-2 max-w-xs text-xs leading-5">
                Enter a timestamp or date, confirm its unit and timezone
                context, then select Convert.
              </p>
            </div>
          )}
        </ToolPanel>
      </ToolWorkspace>

      <section className="mt-20 sm:mt-24" aria-labelledby="timestamp-examples">
        <div className="max-w-2xl">
          <p className="text-primary font-mono text-xs font-medium tracking-[0.18em] uppercase">
            Examples
          </p>
          <h2
            id="timestamp-examples"
            className="text-foreground mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl"
          >
            Explore useful points in Unix time.
          </h2>
          <p className="text-muted-foreground mt-3 text-base leading-7">
            Each example loads its value and explicit unit into the converter.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {examples.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => selectExample(example)}
              className="group focus-visible:ring-ring focus-visible:ring-offset-background rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Card className="group-hover:border-primary/35 h-full p-5 transition-colors motion-reduce:transition-none">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-foreground font-mono text-xs font-semibold">
                    {example.title}
                  </span>
                  <ArrowDownToLine
                    className="text-muted-foreground group-hover:text-primary size-4 shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-muted-foreground mt-3 text-xs leading-5">
                  {example.description}
                </p>
                <span className="text-primary mt-4 block font-mono text-[10px] uppercase">
                  {example.unit}
                </span>
              </Card>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
