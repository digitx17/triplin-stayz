import { motion } from "motion/react";
import { fadeUp, staggerParent } from "@/lib/anim";
import { MaskedLine } from "./Reveal";

export function WhyTravel() {
  return (
    <section id="why" className="border-y border-sand bg-paper py-24 sm:py-32" data-testid="why-section">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
          09 — Why travel?
        </p>
        <h2 className="font-heading text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl" data-testid="why-headline">
          <MaskedLine inView>Travel was never just a subject.</MaskedLine>
          <MaskedLine inView delay={0.15}>
            It became the lens for <em className="not-italic text-terracotta">everything I build.</em>
          </MaskedLine>
        </h2>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-10 text-base leading-relaxed text-muted-foreground sm:grid-cols-2"
        >
          <motion.p variants={fadeUp}>
            It started with tourism education — understanding how destinations, businesses and
            travellers fit together. Then hospitality made it real: hostels in Rishikesh,
            restaurants and bars, guests whose experience depended on a hundred small operational
            decisions.
          </motion.p>
          <motion.p variants={fadeUp}>
            Marketing taught me how travel businesses earn attention. Operations taught me what
            happens after they get it. Somewhere between the two, I started building systems —
            because the gap between a great story and a working business is usually a spreadsheet
            held together with hope.
          </motion.p>
        </motion.div>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 border-l-2 border-terracotta pl-6 font-heading text-lg italic text-ink"
        >
          I'm not chasing a title. I'm building toward something simple: travel businesses that
          market beautifully and run properly.
        </motion.p>
      </div>
    </section>
  );
}
