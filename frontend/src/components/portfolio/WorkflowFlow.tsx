import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerParent } from "@/lib/anim";
import type { FlowStep } from "@/lib/data";

export function WorkflowFlow({
  steps,
  testId,
  warningIndex = -1,
  warningOn = false,
}: {
  steps: FlowStep[];
  testId: string;
  warningIndex?: number;
  warningOn?: boolean;
}) {
  const [active, setActive] = useState(0);

  return (
    <div data-testid={`${testId}-flow`}>
      <motion.ol
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="flex flex-wrap items-center gap-y-3"
      >
        {steps.map((s, i) => {
          const isWarning = warningOn && i === warningIndex;
          const isActive = active === i;
          return (
            <motion.li key={s.label} variants={fadeUp} className="flex items-center">
              <button
                onClick={() => setActive(i)}
                data-testid={`${testId}-step-${i}`}
                className={`rounded-md border px-3.5 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-300 ${
                  isWarning
                    ? "border-red-400/70 bg-[#451A1A] text-[#FCA5A5]"
                    : isActive
                      ? "border-[#E87A54] bg-[#1F2937] text-white"
                      : "border-white/12 bg-transparent text-white/60 hover:border-white/35 hover:text-white"
                }`}
                aria-pressed={isActive}
              >
                <span className={`mr-2 ${isWarning ? "text-red-300" : "text-[#E87A54]"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <ArrowRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-white/25" aria-hidden="true" />
              )}
            </motion.li>
          );
        })}
      </motion.ol>
      <div className="mt-6 min-h-[88px] rounded-md border border-white/10 bg-white/[0.03] p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            data-testid={`${testId}-step-detail`}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E87A54]">
              Step {String(active + 1).padStart(2, "0")} — {steps[active].label}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{steps[active].detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
