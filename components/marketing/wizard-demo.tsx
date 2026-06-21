"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Your details",
    fields: [
      { label: "Name", value: "Alex Mercer" },
      { label: "Email", value: "alex@rowingclub.org" },
      { label: "Role in club", value: "Member" },
    ],
  },
  {
    title: "What happened?",
    fields: [
      { label: "Date of incident", value: "12 April 2026" },
      { label: "Location", value: "Boat house" },
      { label: "Description", value: "Observed concerning behaviour during training" },
    ],
  },
  {
    title: "Impact & consent",
    fields: [
      { label: "Who was involved?", value: "Junior squad member" },
      { label: "Consent to share", value: "Yes, with coach" },
      { label: "Urgency level", value: "Medium" },
    ],
  },
  {
    title: "Review & submit",
    fields: [
      { label: "Summary", value: "Case ready for review" },
      { label: "Attach evidence", value: "(optional)" },
      { label: "Anonymous report", value: "No" },
    ],
  },
];

/** Concatenation of all value chars in a step — used to bound the typing progress. */
function totalValueChars(step: (typeof STEPS)[number]) {
  return step.fields.reduce((sum, f) => sum + f.value.length, 0);
}

/** The direction of the current slide transition. */
type Dir = 1 | -1;

export function WizardDemo() {
  const [stepIdx, setStepIdx] = useState(0);
  const [typed, setTyped] = useState(0); // total characters typed across all fields in this step
  const [direction, setDirection] = useState<Dir>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-100px" });
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = STEPS[stepIdx];
  const totalChars = totalValueChars(step);
  const typingDone = typed >= totalChars;

  // Clear all timers (used on unmount or cleanup)
  const clearTimers = useCallback(() => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
    if (advanceRef.current) {
      clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }
  }, []);

  // Reset typing when step changes
  useEffect(() => {
    setTyped(0);
  }, [stepIdx]);

  // Typing interval — only runs when in view and not done typing
  useEffect(() => {
    if (!inView || typingDone) return;

    const isFast = stepIdx === STEPS.length - 1; // last step types faster (shorter text)
    const speed = isFast ? 15 : 30;

    typingRef.current = setInterval(() => {
      setTyped((prev) => {
        const next = prev + 1;
        if (next >= totalChars) {
          if (typingRef.current) clearInterval(typingRef.current);
          typingRef.current = null;
          // schedule advance to next step
          advanceRef.current = setTimeout(() => {
            if (stepIdx === STEPS.length - 1) {
              setDirection(-1);
              setStepIdx(0);
            } else {
              setDirection(1);
              setStepIdx((p) => p + 1);
            }
          }, 2000);
        }
        return next;
      });
    }, speed);

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (advanceRef.current) clearTimeout(advanceRef.current);
    };
  }, [inView, typingDone, stepIdx, totalChars]);

  // Pause timers when scrolled out of view
  useEffect(() => {
    if (!inView) clearTimers();
  }, [inView, clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Build the current field values based on typed count
  let remaining = typed;
  const filledValues = step.fields.map((f) => {
    const chars = Math.min(remaining, f.value.length);
    remaining -= chars;
    return f.value.slice(0, chars);
  });

  const variants = {
    enter: (dir: Dir) => ({ x: dir * 120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: Dir) => ({ x: dir * -120, opacity: 0 }),
  };

  return (
    <section ref={sectionRef} className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black tracking-tight md:text-5xl">
          See it in action
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Watch a simulated welfare report flow through each step.
        </p>
      </div>

      <div className="mx-auto max-w-lg">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
          {/* Step indicator dots */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  clearTimers();
                  setDirection(i > stepIdx ? 1 : -1);
                  setStepIdx(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === stepIdx
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-border hover:bg-muted-foreground/30",
                )}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={stepIdx}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {/* Step number + title */}
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                  {stepIdx + 1}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {step.title}
                </h3>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                {step.fields.map((field, fi) => (
                  <div key={field.label}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {field.label}
                    </p>
                    <div className="mt-1 min-h-[42px] rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground">
                      {filledValues[fi]}
                      {fi === filledValues.findLastIndex((v) => v.length > 0) &&
                        !typingDone && (
                          <span className="inline-block w-[2px] animate-pulse bg-primary align-text-bottom" />
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
