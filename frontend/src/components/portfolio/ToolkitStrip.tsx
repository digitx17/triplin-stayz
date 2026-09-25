import { useSiteContent } from "@/lib/content";

export function ToolkitStrip() {
  const { content } = useSiteContent();
  const row = [...content.toolkit, ...content.toolkit];
  return (
    <div className="border-y border-sand bg-paper" data-testid="toolkit-strip">
      <p className="pt-5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        Everyday toolkit
      </p>
      <div className="overflow-hidden py-5" aria-hidden="true">
        <div className="animate-marquee flex w-max items-center">
          {row.map((t, i) => (
            <span key={`${t}-${i}`} className="flex items-center font-mono text-xs uppercase tracking-[0.3em] text-ink/70">
              <span className="px-8">{t}</span>
              <span className="text-terracotta">✳</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
