import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Mail, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/anim";
import { apiPost } from "@/lib/api";
import { useSiteContent } from "@/lib/content";
import { scrollToId } from "@/lib/smoothScroll";
import { MaskedLine } from "./Reveal";

const ORANGE = "#E16428";

function Hand({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-hand leading-[1.1] ${className}`} style={{ color: "#1a1a1a" }}>{children}</span>;
}

function Rise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.7, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

const inputCls =
  "w-full rounded-md border border-sand bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-terracotta";
const labelCls = "mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/45";

export function ContactSection() {
  const { content } = useSiteContent();
  const c = content.contact;
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await apiPost("/contact", form);
      toast.success("Message sent — I'll get back to you soon.");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch {
      toast.error("Couldn't send right now — please email me directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="grain relative overflow-hidden bg-[#F7F2E8] text-ink" data-testid="contact-section">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2">
          {/* left — pitch + channels */}
          <div>
            <h2 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl" data-testid="contact-headline">
              <MaskedLine inView>{c.headingA}</MaskedLine>
              <MaskedLine inView delay={0.15}>
                <em className="not-italic text-terracotta">{c.headingB}</em>
              </MaskedLine>
            </h2>
            <svg viewBox="0 0 200 10" className="mt-4 h-3 w-48" fill="none" aria-hidden>
              <path d="M2 7 Q 100 1 198 6" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <Rise delay={0.2}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/65">{c.intro}</p>
            </Rise>

            <Rise delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${c.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:-translate-y-0.5"
                  data-testid="contact-email-button"
                >
                  <Mail className="h-4 w-4" /> Email me
                </a>
                <a
                  href={c.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/25 bg-white/60 px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors duration-300 hover:border-ink"
                  data-testid="contact-linkedin-button"
                >
                  LinkedIn <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={c.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/25 bg-white/60 px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors duration-300 hover:border-ink"
                  data-testid="contact-whatsapp-button"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <button
                  onClick={() => scrollToId("gallery")}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/60 transition-colors duration-300 hover:text-ink"
                  data-testid="contact-view-work-button"
                >
                  View my work
                </button>
              </div>
            </Rise>

            <Rise delay={0.4}>
              <div className="mt-12 border-t border-ink/10 pt-8">
                <Hand className="hidden rotate-[-2deg] text-2xl lg:inline-block">
                  Every project starts
                  <br />
                  with a conversation.
                </Hand>
              </div>
            </Rise>
          </div>

          {/* right — form card */}
          <Rise delay={0.25}>
            <form
              onSubmit={submit}
              className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
              data-testid="contact-form"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">Drop a message</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>Name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="Your name"
                    data-testid="contact-name-input"
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                    placeholder="you@company.com"
                    data-testid="contact-email-input"
                  />
                </label>
              </div>
              <label className="block">
                <span className={labelCls}>Project / message</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputCls} resize-none`}
                  placeholder="Tell me about your travel, hospitality or marketing project…"
                  data-testid="contact-message-input"
                />
              </label>
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                data-testid="contact-honeypot-input"
              />
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-paper transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                data-testid="contact-submit-button"
              >
                <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </Rise>
        </div>
      </div>

      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>© 2026 Vaibhav Kanhere</span>
          <span>{c.footerTagline}</span>
          <span>Travel&nbsp;&nbsp;/&nbsp;&nbsp;Content&nbsp;&nbsp;/&nbsp;&nbsp;Marketing</span>
        </div>
      </footer>
    </section>
  );
}
