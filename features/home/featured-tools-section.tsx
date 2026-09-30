import { SectionHeading } from "@/components/shared/section-heading";
import { ToolCard } from "@/components/shared/tool-card";
import { featuredTools } from "@/tools/registry";

export function FeaturedToolsSection() {
  return (
    <section id="featured-tools" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Featured tools"
          title="The essentials, without the noise."
          description="Focused utilities designed to be quick to open, easy to trust, and pleasant to use every day."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
