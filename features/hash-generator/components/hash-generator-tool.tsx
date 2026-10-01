"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Copy,
  Download,
  Fingerprint,
  Info,
  LoaderCircle,
  LockKeyhole,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  generateHash,
  HASH_ALGORITHMS,
  type GeneratedHash,
  type HashAlgorithm,
} from "@/features/hash-generator/lib/hash-generator";
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

export function HashGeneratorTool({ tool }: { tool: ToolMetadata }) {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [result, setResult] = useState<GeneratedHash | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const requestId = useRef(0);
  const processingRef = useRef(false);
  const inputStats = useMemo(
    () => ({
      lines: input.length === 0 ? 0 : input.split(/\r\n|\r|\n/).length,
      characters: input.length,
    }),
    [input],
  );

  useEffect(
    () => () => {
      requestId.current += 1;
    },
    [],
  );

  function invalidateResult() {
    requestId.current += 1;
    processingRef.current = false;
    setIsProcessing(false);
    setResult(null);
    setStatus(null);
  }

  async function generate() {
    if (processingRef.current) return;
    const currentRequest = ++requestId.current;
    processingRef.current = true;
    setIsProcessing(true);
    setResult(null);
    setStatus(null);

    try {
      // Yield so the processing state can render before synchronous MD5 work.
      await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
      if (currentRequest !== requestId.current) return;
      const generated = await generateHash(input, algorithm);
      if (currentRequest !== requestId.current) return;

      if (!generated.ok) {
        setStatus({ tone: "error", message: generated.error });
        return;
      }
      setResult(generated.value);
      setStatus({
        tone: "success",
        message: `${generated.value.algorithm} hash generated locally.`,
      });
    } catch {
      if (currentRequest === requestId.current) {
        setStatus({
          tone: "error",
          message:
            "The hash could not be generated. Try again with a smaller input.",
        });
      }
    } finally {
      if (currentRequest === requestId.current) {
        processingRef.current = false;
        setIsProcessing(false);
      }
    }
  }

  function clear() {
    invalidateResult();
    setInput("");
    inputRef.current?.focus();
  }

  async function copyHash() {
    if (!result) return;
    const currentRequest = requestId.current;
    try {
      await navigator.clipboard.writeText(result.hash);
      if (currentRequest !== requestId.current) return;
      setStatus({ tone: "info", message: "Hash copied to the clipboard." });
    } catch {
      if (currentRequest !== requestId.current) return;
      setStatus({
        tone: "error",
        message:
          "Clipboard access was unavailable. Select and copy the hash manually.",
      });
    }
  }

  function downloadHash() {
    if (!result) return;
    let url: string | undefined;
    let anchor: HTMLAnchorElement | undefined;
    try {
      const blob = new Blob(
        [`Algorithm: ${result.algorithm}\nHash: ${result.hash}\n`],
        { type: "text/plain;charset=utf-8" },
      );
      url = URL.createObjectURL(blob);
      anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "hash.txt";
      document.body.appendChild(anchor);
      anchor.click();
      setStatus({ tone: "info", message: "Hash download started." });
    } catch {
      setStatus({
        tone: "error",
        message:
          "The download could not start. Copy the hash and save it as a text file.",
      });
    } finally {
      anchor?.remove();
      if (url) {
        const downloadUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 30_000);
      }
    }
  }

  function selectExample(example: ToolExample) {
    invalidateResult();
    setInput(example.input);
    setAlgorithm(example.algorithm ?? "SHA-256");
    setStatus({
      tone: "info",
      message: `Loaded the ${example.title} example. Select Generate Hash to continue.`,
    });
    document.getElementById("tool-workspace")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    inputRef.current?.focus({ preventScroll: true });
  }

  const toolbar = (
    <>
      <ToolToolbar>
        <Button
          size="sm"
          onClick={generate}
          disabled={isProcessing}
          aria-keyshortcuts="Control+Enter Meta+Enter"
        >
          {isProcessing ? (
            <LoaderCircle
              className="animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : (
            <Fingerprint aria-hidden="true" />
          )}
          {isProcessing ? "Generating…" : "Generate Hash"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyHash}
          disabled={!result || isProcessing}
        >
          <Copy aria-hidden="true" />
          Copy Hash
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={downloadHash}
          disabled={!result || isProcessing}
        >
          <Download aria-hidden="true" />
          Download
        </Button>
        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1.5 text-xs">
          <LockKeyhole className="text-primary size-3.5" aria-hidden="true" />
          Your input stays in your browser
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
          void generate();
        }
      }}
    >
      <aside className="border-primary/25 bg-primary/8 mt-8 flex items-start gap-3 rounded-xl border p-4 sm:p-5">
        <LockKeyhole
          className="text-primary mt-0.5 size-5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-foreground font-medium">
            Your input is processed locally in your browser. It is not uploaded
            to a server.
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            Hashing is not encryption. A hash is not intended to be decrypted.
            Avoid pasting passwords, API keys, private keys, authentication
            tokens, or other secrets into online tools.
          </p>
        </div>
      </aside>

      <ToolWorkspace toolbar={toolbar}>
        <ToolPanel
          title="Text input"
          description="Exact UTF-8 text · 5 MiB maximum"
          actions={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clear}
              disabled={!input && !result && !status && !isProcessing}
              aria-label="Clear hash input and result"
            >
              <Trash2 aria-hidden="true" /> Clear
            </Button>
          }
          footer={
            <span className="flex w-full items-center justify-between gap-4">
              <span>{inputStats.lines.toLocaleString()} lines</span>
              <span>{inputStats.characters.toLocaleString()} characters</span>
            </span>
          }
        >
          <fieldset className="border-border bg-secondary/25 border-b p-4 sm:p-5">
            <legend className="sr-only">Hash algorithm</legend>
            <p
              className="text-foreground font-mono text-xs font-semibold"
              aria-hidden="true"
            >
              Algorithm
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {HASH_ALGORITHMS.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={algorithm === value ? "default" : "secondary"}
                  className="h-11 min-w-0 px-2 font-mono text-xs sm:text-sm"
                  aria-pressed={algorithm === value}
                  onClick={() => {
                    if (value !== algorithm) {
                      invalidateResult();
                      setAlgorithm(value);
                    }
                  }}
                >
                  {value}
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground mt-3 text-xs leading-5">
              {algorithm === "SHA-256"
                ? "SHA-256 · modern general-purpose hash · 64 hex characters"
                : `${algorithm} · legacy compatibility only · ${algorithm === "SHA-1" ? 40 : 32} hex characters`}
            </p>
          </fieldset>
          <label htmlFor="hash-input" className="sr-only">
            Text to hash
          </label>
          <textarea
            ref={inputRef}
            id="hash-input"
            value={input}
            onChange={(event) => {
              invalidateResult();
              setInput(event.target.value);
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            placeholder="Enter text to generate a hash. Spaces and line breaks matter."
            className="text-foreground placeholder:text-muted-foreground/65 focus-visible:ring-ring block min-h-80 w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-inset sm:p-5 lg:min-h-[24rem]"
          />
        </ToolPanel>

        <ToolPanel
          title="Hash result"
          description={`${result?.algorithm ?? algorithm} · lowercase hexadecimal`}
          footer={
            <span>
              {result
                ? `${result.inputBytes.toLocaleString()} UTF-8 bytes hashed · ${result.hash.length} hex characters`
                : "Generate a hash to see the result"}
            </span>
          }
        >
          <div
            aria-busy={isProcessing}
            className="bg-background/35 flex h-full min-h-80 flex-col p-5 sm:p-6 lg:min-h-[32rem]"
          >
            {result ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p
                    id="hash-result-title"
                    className="text-foreground text-sm font-medium"
                  >
                    Generated digest
                  </p>
                  <Badge variant="outline" className="font-mono">
                    {result.algorithm}
                  </Badge>
                </div>
                <output
                  aria-labelledby="hash-result-title"
                  className="border-border bg-card text-foreground mt-5 block rounded-lg border p-5 font-mono text-sm leading-7 break-all select-all"
                  id="hash-output"
                >
                  {result.hash}
                </output>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button type="button" variant="secondary" onClick={copyHash}>
                    <Copy aria-hidden="true" /> Copy Hash
                  </Button>
                  <Button type="button" variant="ghost" onClick={downloadHash}>
                    <Download aria-hidden="true" /> Download
                  </Button>
                </div>
                <p className="text-muted-foreground mt-5 text-xs leading-5">
                  The download contains only the algorithm and digest. Your
                  original text is excluded.
                </p>
              </>
            ) : (
              <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center py-12 text-center">
                <span className="border-border bg-secondary flex size-11 items-center justify-center rounded-xl border">
                  {isProcessing ? (
                    <LoaderCircle
                      className="size-5 animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  ) : (
                    <Fingerprint className="size-5" aria-hidden="true" />
                  )}
                </span>
                <p
                  className="text-foreground mt-4 text-sm font-medium"
                  role="status"
                >
                  {isProcessing ? "Generating your hash…" : "Ready to hash"}
                </p>
                <p className="mt-2 max-w-xs text-xs leading-5">
                  {isProcessing
                    ? "Processing UTF-8 text in your browser."
                    : "Enter text, choose an algorithm, and select Generate Hash. You can also use Ctrl/Cmd + Enter."}
                </p>
              </div>
            )}
          </div>
        </ToolPanel>
      </ToolWorkspace>

      <aside className="border-warning/25 bg-warning/8 mt-6 flex items-start gap-3 rounded-xl border p-4 sm:p-5">
        <ShieldAlert
          className="text-warning mt-0.5 size-5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-foreground font-medium">
            SHA-1 and MD5 are legacy algorithms with collision weaknesses.
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            SHA-1 is obsolete for modern security-sensitive applications. MD5 is
            inappropriate for modern security or password storage. For
            passwords, use dedicated algorithms such as Argon2, bcrypt, scrypt,
            or PBKDF2 instead of SHA-256, SHA-1, or MD5.
          </p>
        </div>
      </aside>

      <ToolExamples
        examples={tool.examples}
        onSelect={selectExample}
        title="Try a familiar piece of text."
        showInput
      />
    </div>
  );
}
