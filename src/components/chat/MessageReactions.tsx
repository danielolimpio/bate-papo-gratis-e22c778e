import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";
import { REACTION_EMOJIS, useReactions, type ReactionEmoji } from "@/hooks/useReactions";

interface Props {
  messageId: string;
  align?: "left" | "right";
}

export default function MessageReactions({ messageId, align = "left" }: Props) {
  const { get, toggle } = useReactions();
  const data = get(messageId);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const entries = Object.entries(data.counts) as Array<[ReactionEmoji, number]>;
  const total = entries.reduce((s, [, n]) => s + n, 0);

  return (
    <div ref={wrapRef} className={`relative mt-0.5 flex items-center gap-1 ${align === "right" ? "justify-end" : ""}`}>
      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="opacity-60 hover:opacity-100 transition-opacity rounded-full p-0.5"
        aria-label="Reagir"
      >
        <Smile size={14} className="text-muted-foreground" />
      </button>

      {/* contagens existentes */}
      {entries.length > 0 && (
        <div className="flex items-center gap-0.5 rounded-full bg-secondary/80 px-1.5 py-0.5">
          {entries.slice(0, 4).map(([e]) => (
            <span key={e} className="text-[11px] leading-none">
              {e}
            </span>
          ))}
          {total > 1 && <span className="text-[10px] text-muted-foreground ml-0.5">{total}</span>}
        </div>
      )}

      {/* picker */}
      {open && (
        <div
          className={`absolute z-20 -top-10 ${align === "right" ? "right-0" : "left-0"} flex items-center gap-1 rounded-full bg-popover border border-border shadow-lg px-2 py-1.5`}
        >
          {REACTION_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                toggle(messageId, e);
                setOpen(false);
              }}
              className={`text-base leading-none transition-transform hover:scale-125 ${data.mine === e ? "scale-125" : ""}`}
              aria-label={`Reagir com ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
