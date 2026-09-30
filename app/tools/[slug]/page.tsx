import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonFormatterTool } from "@/features/json-formatter/components/json-formatter-tool";
import { JsonValidatorTool } from "@/features/json-validator/components/json-validator-tool";
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
        <ToolCommonMistakes
          mistakes={tool.commonMistakes}
          title={
            tool.slug === "json-validator" ? "Common JSON errors" : undefined
          }
        />
        <RelatedTools slugs={tool.relatedTools} />
        <ToolFAQ
          items={tool.faq}
          title={
            tool.slug === "json-validator" ? "About JSON validation" : undefined
          }
        />
      </div>
    </ToolPageShell>
  );
}
