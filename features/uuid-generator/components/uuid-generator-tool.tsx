"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Clipboard,
  Copy,
  Download,
  Fingerprint,
  Info,
  LockKeyhole,
  RefreshCw,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  generateUuids,
  UUID_QUANTITIES,
  type UuidQuantity,
} from "@/features/uuid-generator/lib/uuid-generator";
import {
  ToolPanel,
  ToolToolbar,
  ToolWorkspace,
} from "@/features/tool-engine/components/tool-workspace";
import { cn } from "@/lib/utils";

type Status = {
  tone: "success" | "error" | "info";
  message: string;
} | null;

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

function EmptyOutput() {
  return (
    <div className="text-muted-foreground flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center lg:min-h-[32rem]">
      <span className="border-border bg-secondary flex size-11 items-center justify-center rounded-xl border">
        <Fingerprint className="size-5" aria-hidden="true" />
      </span>
      <p className="text-foreground mt-4 text-sm font-medium">
        Ready to generate
      </p>
      <p className="mt-2 max-w-xs text-xs leading-5">
        Choose a quantity and generate a fresh UUID v4 batch. Nothing is
        generated until you ask.
      </p>
    </div>
  );
}

export function UuidGeneratorTool() {
  const [quantity, setQuantity] = useState<UuidQuantity>(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>(null);

  function generate() {
    const result = generateUuids(quantity);

    if (!result.ok) {
      setUuids([]);
      setStatus({ tone: "error", message: result.error });
      return;
    }

    setUuids(result.values);
    setStatus({
      tone: "success",
      message: `${result.values.length} fresh UUID${result.values.length === 1 ? "" : "s"} generated locally.`,
    });
  }

  function clear() {
    setUuids([]);
    setStatus(null);
  }

  async function copyValue(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus({ tone: "info", message: `${label} copied to the clipboard.` });
    } catch {
      setStatus({
        tone: "error",
        message: "Clipboard access was unavailable. Select the UUID manually.",
      });
    }
  }

  function download() {
    if (uuids.length === 0) return;

    const blob = new Blob([uuids.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "uuids.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    setStatus({ tone: "info", message: "UUID download started." });
  }

  const toolbar = (
    <>
      <ToolToolbar>
        <Button
          size="sm"
          onClick={generate}
          aria-keyshortcuts="Control+Enter Meta+Enter"
        >
          <RefreshCw aria-hidden="true" />
          Generate UUIDs
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={uuids.length === 0}
          onClick={() => copyValue("UUID list", uuids.join("\n"))}
        >
          <Clipboard aria-hidden="true" />
          Copy all
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={uuids.length === 0}
          onClick={download}
        >
          <Download aria-hidden="true" />
          Download
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={uuids.length === 0}
          onClick={clear}
        >
          <Trash2 aria-hidden="true" />
          Clear
        </Button>
        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1.5 text-xs">
          <LockKeyhole className="text-primary size-3.5" aria-hidden="true" />
          Generated locally in your browser
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
          generate();
        }
      }}
    >
      <aside className="border-warning/25 bg-warning/8 mt-8 flex items-start gap-3 rounded-xl border p-4 sm:p-5">
        <ShieldAlert
          className="text-warning mt-0.5 size-5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-foreground font-medium">
            UUIDs are identifiers, not security controls.
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            UUID v4 values have a statistically negligible collision
            probability, but they do not provide authentication, authorization,
            encryption, or secrecy.
          </p>
        </div>
      </aside>

      <ToolWorkspace toolbar={toolbar}>
        <ToolPanel
          title="Generation settings"
          description="Browser-native UUID version 4"
          footer={<span>crypto.randomUUID()</span>}
        >
          <div className="flex min-h-80 flex-col p-5 sm:p-6 lg:min-h-[32rem]">
            <fieldset>
              <legend className="text-foreground font-mono text-sm font-semibold">
                Quantity
              </legend>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Select how many independent UUID v4 identifiers to generate.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {UUID_QUANTITIES.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={quantity === value ? "default" : "secondary"}
                    className="h-12 font-mono"
                    aria-pressed={quantity === value}
                    onClick={() => setQuantity(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </fieldset>

            <div className="border-border bg-secondary/35 mt-6 rounded-xl border p-5">
              <div className="flex items-center gap-3">
                <Fingerprint
                  className="text-primary size-5"
                  aria-hidden="true"
                />
                <p className="text-foreground font-medium">UUID v4</p>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                Random identifiers in the canonical 8-4-4-4-12 format. Every
                Generate action replaces the previous batch.
              </p>
            </div>

            <Button size="lg" className="mt-6 w-full" onClick={generate}>
              <RefreshCw aria-hidden="true" />
              Generate {quantity} UUID{quantity === 1 ? "" : "s"}
            </Button>
          </div>
        </ToolPanel>

        <ToolPanel
          title="Generated UUIDs"
          description="Fresh results from this browser"
          footer={
            <span>
              {uuids.length.toLocaleString()} UUID
              {uuids.length === 1 ? "" : "s"}
            </span>
          }
        >
          {uuids.length === 0 ? (
            <EmptyOutput />
          ) : (
            <ol className="max-h-[32rem] min-h-80 overflow-y-auto p-3 sm:p-4 lg:min-h-[32rem]">
              {uuids.map((uuid, index) => (
                <li
                  key={`${uuid}-${index}`}
                  className="border-border group flex min-w-0 items-center gap-3 border-b px-2 py-3 last:border-b-0"
                >
                  <span className="text-muted-foreground w-7 shrink-0 text-right font-mono text-[11px]">
                    {index + 1}
                  </span>
                  <code className="text-foreground min-w-0 flex-1 font-mono text-xs break-all sm:text-sm">
                    {uuid}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyValue("UUID", uuid)}
                    aria-label={`Copy UUID ${index + 1}`}
                  >
                    <Copy aria-hidden="true" />
                    <span className="hidden sm:inline">Copy</span>
                  </Button>
                </li>
              ))}
            </ol>
          )}
        </ToolPanel>
      </ToolWorkspace>
    </div>
  );
}
