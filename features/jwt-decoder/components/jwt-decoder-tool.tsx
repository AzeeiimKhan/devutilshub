"use client";

import { useMemo, useRef, useState } from "react";
import {
  Braces,
  CheckCircle2,
  CircleAlert,
  Clipboard,
  Clock3,
  Download,
  FileJson2,
  Info,
  KeyRound,
  LockKeyhole,
  ShieldAlert,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  decodeJwt,
  decodedJwtAsText,
  decodedJwtDownload,
  type DecodedJwt,
  type JwtTimeClaim,
} from "@/features/jwt-decoder/lib/jwt-decoder";
import { ToolExamples } from "@/features/tool-engine/components/tool-examples";
import {
  ToolPanel,
  ToolToolbar,
  ToolWorkspace,
} from "@/features/tool-engine/components/tool-workspace";
import { cn } from "@/lib/utils";
import type { ToolExample, ToolMetadata } from "@/types/tool";

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

function ResultOverview({ decoded }: { decoded: DecodedJwt | null }) {
  if (!decoded) {
    return (
      <div className="text-muted-foreground flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center lg:min-h-[26rem]">
        <span className="border-border bg-secondary flex size-11 items-center justify-center rounded-xl border">
          <FileJson2 className="size-5" aria-hidden="true" />
        </span>
        <p className="text-foreground mt-4 text-sm font-medium">
          Ready to inspect
        </p>
        <p className="mt-2 max-w-xs text-xs leading-5">
          Decode a three-section JWT to inspect its header and payload. No
          signature verification is performed.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-72 p-5 sm:p-6 lg:min-h-[26rem]">
      <div className="border-success/25 bg-success/8 rounded-xl border p-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-success size-5" aria-hidden="true" />
          <p className="text-success font-mono text-xs font-semibold tracking-[0.1em]">
            JWT STRUCTURE DECODED
          </p>
        </div>
        <p className="text-foreground mt-3 text-sm leading-6">
          Header and payload contain JSON objects.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="border-border bg-secondary/35 rounded-lg border p-3">
          <p className="text-muted-foreground text-[11px] uppercase">
            Algorithm
          </p>
          <p className="text-foreground mt-1 font-mono text-sm break-all">
            {decoded.algorithm ?? "Not specified"}
          </p>
        </div>
        <div className="border-border bg-secondary/35 rounded-lg border p-3">
          <p className="text-muted-foreground text-[11px] uppercase">Type</p>
          <p className="text-foreground mt-1 font-mono text-sm break-all">
            {decoded.tokenType ?? "Not specified"}
          </p>
        </div>
      </div>

      <div className="border-warning/25 bg-warning/8 mt-4 flex items-start gap-3 rounded-lg border p-4">
        <ShieldAlert
          className="text-warning mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-foreground text-sm font-medium">
            Signature not verified
          </p>
          <p className="text-muted-foreground mt-1 text-xs leading-5">
            Decoded content is not proof that the token or claims are authentic.
          </p>
        </div>
      </div>
    </div>
  );
}

function JsonSection({
  title,
  value,
  onCopy,
}: {
  title: "Header" | "Payload";
  value: string;
  onCopy: () => void;
}) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <div className="border-border flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <Braces className="text-primary size-4" aria-hidden="true" />
          <h3 className="text-foreground font-mono text-sm font-semibold">
            {title}
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCopy}>
          <Clipboard aria-hidden="true" />
          Copy {title}
        </Button>
      </div>
      <pre className="bg-background/45 text-foreground max-h-96 overflow-auto p-4 font-mono text-xs leading-6 sm:p-5">
        {value}
      </pre>
    </Card>
  );
}

function claimTone(claim: JwtTimeClaim) {
  if (claim.status === "expired")
    return "border-error/30 bg-error/8 text-error";
  if (claim.status === "not-active")
    return "border-warning/30 bg-warning/8 text-warning";
  if (claim.status === "active" || claim.status === "already-active")
    return "border-success/30 bg-success/8 text-success";
  return "border-primary/30 bg-primary/8 text-primary";
}

function ClaimsSection({ claims }: { claims: JwtTimeClaim[] }) {
  return (
    <section className="mt-6" aria-labelledby="jwt-claims-title">
      <div className="flex items-center gap-3">
        <Clock3 className="text-primary size-5" aria-hidden="true" />
        <h3
          id="jwt-claims-title"
          className="text-foreground text-lg font-semibold"
        >
          Claims / time information
        </h3>
      </div>
      {claims.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {claims.map((claim) => (
            <Card key={claim.name} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-foreground font-mono text-sm font-semibold">
                  {claim.label}
                </p>
                <Badge variant="outline" className={claimTone(claim)}>
                  {claim.statusLabel}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-4 font-mono text-xs">
                {claim.name}: {claim.value}
              </p>
              <p className="text-foreground mt-2 text-sm leading-6">
                {claim.isoDate
                  ? new Date(claim.isoDate).toLocaleString()
                  : "Date unavailable"}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-muted-foreground mt-4 p-5 text-sm leading-6">
          No numeric iat, exp, or nbf claims were found. Other claims remain
          visible in the payload above.
        </Card>
      )}
      <p className="text-muted-foreground mt-3 text-xs leading-5">
        Statuses are unverified observations based on this browser’s current
        clock, not authentication decisions.
      </p>
    </section>
  );
}

function DecodedSections({
  decoded,
  onCopy,
}: {
  decoded: DecodedJwt;
  onCopy: (label: string, value: string) => void;
}) {
  return (
    <section className="mt-8" aria-labelledby="decoded-jwt-title">
      <h2 id="decoded-jwt-title" className="sr-only">
        Decoded JWT information
      </h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <JsonSection
          title="Header"
          value={decoded.prettyHeader}
          onCopy={() => onCopy("Header", decoded.prettyHeader)}
        />
        <JsonSection
          title="Payload"
          value={decoded.prettyPayload}
          onCopy={() => onCopy("Payload", decoded.prettyPayload)}
        />
      </div>

      <ClaimsSection claims={decoded.claims} />

      <Card className="mt-6 overflow-hidden">
        <div className="border-border flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <KeyRound className="text-warning size-4" aria-hidden="true" />
            <h3 className="text-foreground font-mono text-sm font-semibold">
              Signature
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy("Signature", decoded.signature)}
          >
            <Clipboard aria-hidden="true" />
            Copy Signature
          </Button>
        </div>
        <div className="p-4 sm:p-5">
          <code className="border-border bg-background text-foreground block overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-5 break-all whitespace-pre-wrap">
            {decoded.signature}
          </code>
          <div className="text-warning mt-3 flex items-center gap-2 text-sm font-medium">
            <TriangleAlert className="size-4" aria-hidden="true" />
            Signature not verified
          </div>
        </div>
      </Card>
    </section>
  );
}

export function JwtDecoderTool({ tool }: { tool: ToolMetadata }) {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const characters = useMemo(() => input.length, [input]);

  function runDecode() {
    const result = decodeJwt(input);

    if (!result.ok) {
      setDecoded(null);
      setStatus({ tone: "error", message: result.error });
      return;
    }

    setDecoded(result.value);
    setStatus({
      tone: "success",
      message: "JWT structure decoded successfully. Signature not verified.",
    });
  }

  function clear() {
    setInput("");
    setDecoded(null);
    setStatus(null);
    inputRef.current?.focus();
  }

  async function copyValue(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus({ tone: "info", message: `${label} copied to the clipboard.` });
    } catch {
      setStatus({
        tone: "error",
        message: "Clipboard access was unavailable. Select the text manually.",
      });
    }
  }

  function download() {
    if (!decoded) return;

    const content = JSON.stringify(decodedJwtDownload(decoded), null, 2);
    const blob = new Blob([content], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "jwt-decoded.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    setStatus({ tone: "info", message: "Decoded JWT download started." });
  }

  function selectExample(example: ToolExample) {
    setInput(example.input);
    setDecoded(null);
    setStatus({
      tone: "info",
      message: `Loaded the “${example.title}” demonstration example.`,
    });
    document
      .getElementById("tool-workspace")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    inputRef.current?.focus({ preventScroll: true });
  }

  const toolbar = (
    <>
      <ToolToolbar>
        <Button size="sm" onClick={runDecode}>
          <FileJson2 aria-hidden="true" />
          Decode
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={!decoded}
          onClick={() =>
            decoded && copyValue("All decoded data", decodedJwtAsText(decoded))
          }
        >
          <Clipboard aria-hidden="true" />
          Copy all
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={!decoded}
          onClick={download}
        >
          <Download aria-hidden="true" />
          Download
        </Button>
        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1.5 text-xs">
          <LockKeyhole className="text-primary size-3.5" aria-hidden="true" />
          Your JWT never leaves your browser
        </span>
      </ToolToolbar>
      <StatusNotice status={status} />
    </>
  );

  return (
    <>
      <aside className="border-warning/25 bg-warning/8 mt-8 flex items-start gap-3 rounded-xl border p-4 sm:p-5">
        <ShieldAlert
          className="text-warning mt-0.5 size-5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-foreground font-medium">
            Decoding a JWT does not verify its signature.
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            JWT payloads are encoded, not encrypted. Decoded claims are not
            automatically authentic or trustworthy.
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Do not paste production access tokens into tools unless you
            understand the security implications. This decoder processes input
            locally but does not make sensitive tokens consequence-free.
          </p>
        </div>
      </aside>

      <ToolWorkspace toolbar={toolbar}>
        <ToolPanel
          title="JWT input"
          description="header.payload.signature"
          actions={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clear}
              disabled={!input && !decoded}
              aria-label="Clear JWT input and decoded output"
            >
              <Trash2 aria-hidden="true" />
              Clear
            </Button>
          }
          footer={
            <span className="flex w-full items-center justify-between gap-4">
              <span>3 sections expected</span>
              <span>{characters.toLocaleString()} characters</span>
            </span>
          }
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setDecoded(null);
              setStatus(null);
            }}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                runDecode();
              }
            }}
            aria-label="JWT token input"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="Paste a JWT with header, payload, and signature sections."
            className="text-foreground placeholder:text-muted-foreground/65 focus-visible:ring-ring block min-h-72 w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-6 break-all outline-none focus-visible:ring-2 focus-visible:ring-inset sm:p-5 lg:min-h-[26rem]"
          />
        </ToolPanel>

        <ToolPanel
          title="Token status"
          description="Structure only—signature not verified"
          footer={<span>Decoder / inspector only</span>}
        >
          <ResultOverview decoded={decoded} />
        </ToolPanel>
      </ToolWorkspace>

      {decoded ? (
        <DecodedSections decoded={decoded} onCopy={copyValue} />
      ) : null}

      <ToolExamples examples={tool.examples} onSelect={selectExample} />
    </>
  );
}
