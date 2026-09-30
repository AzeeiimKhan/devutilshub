import { Plus } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

const questions = [
  {
    question: "Does DevUtilsHub upload my data?",
    answer:
      "No. The utilities are designed to process input locally in your browser. The first release will not require a backend for tool processing.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. The core developer utilities will be available without signing in or creating an account.",
  },
  {
    question: "Which tools are coming first?",
    answer:
      "The initial set is planned around JSON formatting, JSON validation, JSON comparison, and Base64 encoding and decoding.",
  },
  {
    question: "Will the tools work on mobile devices?",
    answer:
      "Yes. The interface is being designed for desktop, tablet, and mobile, though larger data workflows will naturally be more comfortable on a wider screen.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          eyebrow="FAQ"
          title="A few useful answers."
          description="What to expect from a privacy-first developer utility suite."
        />
        <div className="divide-border border-border divide-y border-y">
          {questions.map((item) => (
            <details key={item.question} className="group">
              <summary className="text-foreground hover:text-primary focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium transition-colors outline-none focus-visible:ring-2 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <Plus
                  className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <p className="text-muted-foreground max-w-2xl pb-5 text-sm leading-6">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
