import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Base64Tool } from "@/features/base64/components/base64-tool";
import { JsonCompareTool } from "@/features/json-compare/components/json-compare-tool";
import { JsonFormatterTool } from "@/features/json-formatter/components/json-formatter-tool";
import { JsonValidatorTool } from "@/features/json-validator/components/json-validator-tool";
import { JwtDecoderTool } from "@/features/jwt-decoder/components/jwt-decoder-tool";
import { UrlEncodingTool } from "@/features/url-encoding/components/url-encoding-tool";
import {
  RelatedTools,
  ToolCommonMistakes,
  ToolFAQ,
} from "@/features/tool-engine/components/tool-content-sections";
import { ToolPageShell } from "@/features/tool-engine/components/tool-page-shell";
import { getToolBySlug, tools } from "@/tools/registry";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tools
    .filter((tool) => tool.availability === "available")
    .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool || tool.availability !== "available") {
    return {
      title: "Tool not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: tool.title,
    description: tool.description,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.title} — DevUtilsHub`,
      description: tool.description,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool || tool.availability !== "available") notFound();

  return (
    <ToolPageShell tool={tool}>
      <div className="container-shell">
        {tool.slug === "json-formatter" ? (
          <JsonFormatterTool tool={tool} />
        ) : null}
        {tool.slug === "json-validator" ? (
          <JsonValidatorTool tool={tool} />
        ) : null}
        {tool.slug === "json-compare" ? <JsonCompareTool tool={tool} /> : null}
        {tool.slug === "base64" ? <Base64Tool tool={tool} /> : null}
        {tool.slug === "url-encode-decode" ? (
          <UrlEncodingTool tool={tool} />
        ) : null}
        {tool.slug === "jwt-decoder" ? <JwtDecoderTool tool={tool} /> : null}
        <ToolCommonMistakes
          mistakes={tool.commonMistakes}
          title={
            tool.slug === "json-validator"
              ? "Common JSON errors"
              : tool.slug === "json-compare"
                ? "Comparison notes"
                : tool.slug === "base64"
                  ? "Base64 essentials"
                  : tool.slug === "url-encode-decode"
                    ? "URL encoding essentials"
                    : tool.slug === "jwt-decoder"
                      ? "JWT decoding essentials"
                      : undefined
          }
        />
        <RelatedTools slugs={tool.relatedTools} />
        <ToolFAQ
          items={tool.faq}
          title={
            tool.slug === "json-validator"
              ? "About JSON validation"
              : tool.slug === "json-compare"
                ? "About JSON comparison"
                : tool.slug === "base64"
                  ? "About Base64"
                  : tool.slug === "url-encode-decode"
                    ? "About URL encoding"
                    : tool.slug === "jwt-decoder"
                      ? "About JWT decoding"
                      : undefined
          }
        />
      </div>
    </ToolPageShell>
  );
}
