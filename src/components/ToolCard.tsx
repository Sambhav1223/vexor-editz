import { Gauge, Sparkles } from "lucide-react";
import type { Tool } from "@/config/tools";

function Badge({ kind }: { kind: Tool["badge"] }) {
  const base = "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg";
  if (kind === "ae" || kind === "pr") {
    return (
      <span
        className={`${base} border border-[#9999FF]/40 bg-[#00005B] font-sans text-lg font-bold text-[#9999FF]`}
        aria-hidden="true"
      >
        {kind === "ae" ? "Ae" : "Pr"}
      </span>
    );
  }
  return (
    <span className={`${base} border border-accent-soft/30 bg-accent/15 text-accent-soft`} aria-hidden="true">
      {kind === "topaz" ? <Sparkles size={22} /> : <Gauge size={22} />}
    </span>
  );
}

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <li className="card flex items-center gap-4 p-4 transition-colors duration-300 hover:border-accent/60">
      <Badge kind={tool.badge} />
      <div>
        <p className="font-semibold leading-tight">{tool.name}</p>
        <p className="mt-1 text-sm text-muted">{tool.role}</p>
      </div>
    </li>
  );
}
