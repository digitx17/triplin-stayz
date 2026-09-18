import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Mail, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { fadeUp, staggerParent } from "@/lib/anim";
import { apiPost } from "@/lib/api";
import { CONTACT } from "@/lib/data";
import { scrollToId } from "@/lib/smoothScroll";
import { MaskedLine } from "./Reveal";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await apiPost("/contact", form);
      toast.success("Message sent — I'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Couldn't send right now — please email me directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="bg-night text-[#F5F5F3]" data-testid="contact-section">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <p className="mb-8 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#E87A54]">
          09 — Contact
        </p>
        <h2 className="max-w-4xl font-heading text-3xl font-medium leading-[1.12] tracking-tight sm:text-5xl" data-testid="contact-headline">
          <MaskedLine inView>Have a travel, hospitality</MaskedLine>
          <MaskedLine inView delay={0.15}>
            or <em className="not-italic text-[#E87A54]">marketing project?</em>
          </MaskedLine>
        </h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 max-w-xl text-base leading-relaxed text-white/60"
        >
          I'm open to opportunities in tourism, hospitality marketing, travel content, freelance
          projects and travel product building.
        </motion.p>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid gap-14 lg:grid-cols-2"
        >
          <div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#E87A54] px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-night transition-transform duration-300 hover:-translate-y-0.5"
                data-testid="contact-email-button"
              >
                <Mail className="h-4 w-4" /> Email me
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-white/10"
                data-testid="contact-linkedin-button"
              >
                LinkedIn <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-white/10"
                data-testid="contact-whatsapp-button"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <button
                onClick={() => scrollToId("gallery")}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60 transition-colors duration-300 hover:text-white"
                data-testid="contact-view-work-button"
              >
                View my work
              </button>
            </motion.div>
            <motion.dl variants={fadeUp} className="mt-14 space-y-5 border-t border-white/10 pt-8">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Email</dt>
                <dd className="mt-1 text-sm text-white/80">{CONTACT.email}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Based in</dt>
                <dd className="mt-1 text-sm text-white/80">India · open to remote & on-site</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Focus</dt>
                <dd className="mt-1 text-sm text-white/80">
                  Tourism & hospitality marketing · content · travel systems
                </dd>
              </div>
            </motion.dl>
          </div>

          <motion.form variants={fadeUp} onSubmit={submit} className="space-y-4" data-testid="contact-form">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#E87A54]"
                  placeholder="Your name"
                  data-testid="contact-name-input"
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#E87A54]"
                  placeholder="you@company.com"
                  data-testid="contact-email-input"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Project / message</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#E87A54]"
                placeholder="Tell me about your travel, hospitality or marketing project…"
                data-testid="contact-message-input"
              />
            </label>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-full bg-[#F5F5F3] px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-night transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50"
              data-testid="contact-submit-button"
            >
              <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send message"}
            </button>
          </motion.form>
        </motion.div>
      </div>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© 2026 Vaibhav Kanhere</span>
          <span>I market travel businesses — and I build the systems behind them.</span>
          <span>Photography: curated placeholders, swappable</span>
        </div>
      </footer>
    </section>
  );
}
