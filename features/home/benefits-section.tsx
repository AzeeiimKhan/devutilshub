import { CloudOff, Gauge, Laptop, ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

const benefits = [
  {
    title: "Browser-only",
    description:
      "Processing happens locally using capabilities already in your browser.",
    icon: Laptop,
  },
  {
    title: "Privacy-first",
    description:
      "Sensitive payloads are not sent to DevUtilsHub or stored on a server.",
    icon: ShieldCheck,
  },
  {
    title: "Fast by default",
    description:
      "No round trips, queues, or account gates between you and the result.",
    icon: Gauge,
  },
  {
    title: "No unnecessary uploads",
    description:
      "Your work remains on your device unless you deliberately move it elsewhere.",
    icon: CloudOff,
  },
] as const;

export function BenefitsSection() {
  return (
    <section
      id="why-devutilshub"
      className="border-border bg-card/30 scroll-mt-24 border-y py-20 sm:py-24"
    >
      <div className="container-shell">
        <SectionHeading
          eyebrow="Why DevUtilsHub"
          title="Useful tools should not require a trust exercise."
          description="The product is designed around a simple promise: keep the workflow quick and keep the data yours."
        />
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article key={benefit.title}>
                <span className="border-primary/20 bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg border">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-foreground mt-5 font-mono text-sm font-semibold">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
