import { SectionHeading } from "@/components/shared/section-heading";
import { ToolCard } from "@/components/shared/tool-card";
import { categories } from "@/metadata/categories";
import { availableTools } from "@/tools/registry";

export function AllToolsSection() {
  return (
    <section id="all-tools" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="All tools"
          title="Your complete browser-based toolkit."
          description={`Explore all ${availableTools.length} available tools. Choose a workflow and get started without uploads or an account.`}
        />
        <div className="mt-10 space-y-12">
          {categories.map((category) => {
            const categoryTools = availableTools.filter(
              (tool) => tool.category === category.id,
            );

            if (categoryTools.length === 0) return null;

            return (
              <div
                key={category.id}
                id={`tools-${category.id}`}
                className="scroll-mt-24"
              >
                <h3 className="text-foreground mb-5 font-mono text-lg font-semibold">
                  {category.title}
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <ToolCard
                      key={tool.slug}
                      tool={tool}
                      id={`catalog-tool-${tool.slug}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
