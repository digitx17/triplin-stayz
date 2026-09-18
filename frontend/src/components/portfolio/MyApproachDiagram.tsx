import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { fadeUp, scaleIn, staggerParent } from "@/lib/anim";
import { SectionHeading } from "./Reveal";

const NODES = [
  { title: "Customer", note: "Who it's for, what they dream about, why they book." },
  { title: "Content", note: "The stories, reels and photography that earn attention." },
  { title: "Distribution", note: "Where the story travels — social, search, listings, OTAs." },
  { title: "Operations", note: "What happens after the booking — the real product." },
  { title: "Technology", note: "The systems that hold all of it together." },
];

const CHAIN = ["Business", "Customer", "Marketing", "Content", "Distribution", "Operations", "Technology"];

export function MyApproachDiagram() {
  return (
    <section id="approach" className="bg-stone py-24 sm:py-32" data-testid="approach-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="06 — My Approach" title="Marketing connects the pieces." testId="approach-heading" />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="-mt-6 mb-16 max-w-2xl text-base leading-relaxed text-muted-foreground"
        >
          I don't look at travel marketing as only social media. I look at the complete system —
          and at how each piece feeds the next.
        </motion.p>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
          data-testid="approach-diagram"
        >
          {NODES.slice(0, 3).map((n) => (
            <NodeCard key={n.title} title={n.title} note={n.note} />
          ))}
          <NodeCard title={NODES[3].title} note={NODES[3].note} />
          <motion.div
            variants={scaleIn}
            className="flex min-h-40 flex-col items-center justify-center rounded-md bg-ink p-6 text-center text-paper"
            data-testid="approach-center"
          >
            <p className="font-heading text-xl italic leading-snug sm:text-2xl">
              “Marketing connects the pieces.”
            </p>
          </motion.div>
          <NodeCard title={NODES[4].title} note={NODES[4].note} />
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-16 flex flex-wrap items-center justify-center gap-y-3"
          data-testid="approach-chain"
        >
          {CHAIN.map((c, i) => (
            <motion.span key={c} variants={fadeUp} className="flex items-center">
              <span className="rounded-full border border-sand bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/75">
                {c}
              </span>
              {i < CHAIN.length - 1 && <ArrowRight className="mx-1.5 h-3.5 w-3.5 text-terracotta" aria-hidden="true" />}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function NodeCard({ title, note }: { title: string; note: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group min-h-40 rounded-md border border-sand bg-paper p-6 transition-colors duration-300 hover:border-terracotta"
      data-testid={`approach-node-${title.toLowerCase()}`}
    >
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note}</p>
    </motion.div>
  );
}
