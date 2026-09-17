import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { scrollToId } from "@/lib/smoothScroll";
import { EASE } from "@/lib/anim";

const LINKS = [
  { label: "Work", id: "built" },
  { label: "Experience", id: "experience" },
  { label: "About", id: "story" },
  { label: "Travel", id: "road" },
  { label: "Contact", id: "contact" },
];

export function NavigationHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-35% 0px -60% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 text-ink transition-colors duration-500 ${
          open ? "" : scrolled ? "border-b border-sand bg-paper/85 backdrop-blur-md" : ""
        }`}
        data-testid="nav-header"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => go("top")}
            className="font-heading text-lg font-semibold tracking-[0.18em]"
            data-testid="nav-logo"
          >
            VAIBHAV
          </button>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  active === l.id
                    ? "bg-ink text-paper"
                    : "text-muted-foreground hover:text-ink"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>
          <button
            className="rounded-full border border-current/30 p-2 md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            data-testid="nav-menu-open"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[80] flex flex-col bg-night text-[#F5F5F3]"
            data-testid="mobile-menu"
          >
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <span className="font-heading text-lg font-semibold tracking-[0.18em]">VAIBHAV</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-full border border-white/25 p-2"
                data-testid="nav-menu-close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <span key={l.id} className="block overflow-hidden">
                  <motion.button
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.6, delay: 0.08 + i * 0.06, ease: EASE }}
                    onClick={() => go(l.id)}
                    className="flex items-baseline gap-4 py-2 text-left"
                    data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                  >
                    <span className="font-mono text-xs text-[#E87A54]">0{i + 1}</span>
                    <span className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
                      {l.label}
                    </span>
                  </motion.button>
                </span>
              ))}
            </nav>
            <p className="px-8 pb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              I market travel businesses — and I build the systems behind them.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
