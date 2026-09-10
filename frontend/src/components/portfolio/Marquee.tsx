const WORDS = [
  "Marketing",
  "Tourism",
  "Hospitality",
  "Content",
  "Travel Operations",
  "Digital Products",
  "Travel Systems",
];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y border-sand bg-paper py-5" aria-hidden="true" data-testid="editorial-marquee">
      <div className="animate-marquee flex w-max items-center">
        {row.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="flex items-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            <span className="px-8">{w}</span>
            <span className="text-terracotta">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
