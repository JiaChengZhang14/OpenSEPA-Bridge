"use client";

export type LogEntry = {
  type: "info" | "ok" | "error" | "warn";
  text: string;
};

interface StatusLogProps {
  entries: LogEntry[];
  loading?: boolean;
}

const PREFIX: Record<LogEntry["type"], string> = {
  info: "··",
  ok:   "✓ ",
  error: "✗ ",
  warn: "⚠ ",
};

const COLOR: Record<LogEntry["type"], string> = {
  info:  "text-brand-textDim",
  ok:    "text-brand-green",
  error: "text-red-400",
  warn:  "text-amber-400",
};

export default function StatusLog({ entries, loading }: StatusLogProps) {
  return (
    <div className="bg-brand-bg border border-brand-border rounded-sm p-4 font-mono text-xs space-y-1 min-h-[96px]">
      {entries.map((e, i) => (
        <div
          key={i}
          className={`flex gap-2 animate-fadeUp ${COLOR[e.type]}`}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <span className="opacity-50 shrink-0">{PREFIX[e.type]}</span>
          <span>{e.text}</span>
        </div>
      ))}

      {loading && (
        <div className="flex gap-2 text-brand-textDim">
          <span className="opacity-50">··</span>
          <span className="animate-pulse_soft">procesando...</span>
        </div>
      )}

      {entries.length === 0 && !loading && (
        <p className="text-brand-muted">Esperando fichero...</p>
      )}
    </div>
  );
}
