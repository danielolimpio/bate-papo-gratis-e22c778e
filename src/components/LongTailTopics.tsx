import { Tag } from "lucide-react";

interface LongTailTopicsProps {
  title?: string;
  intro?: string;
  terms: string[];
  accent?: "blue" | "amber" | "pink";
}

const accentMap = {
  blue: "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100",
  amber: "border-amber-100 bg-amber-50 text-amber-800 hover:bg-amber-100",
  pink: "border-pink-100 bg-pink-50 text-pink-700 hover:bg-pink-100",
};

/**
 * Renders a curated long-tail keyword cloud as a semantic <section>.
 * Visible to crawlers and useful for users — also acts as an internal
 * topical map for related searches like "bate papo grátis", "chat
 * online", "sala de bate papo", "chat na internet", etc.
 */
export default function LongTailTopics({
  title = "Tópicos populares relacionados",
  intro,
  terms,
  accent = "blue",
}: LongTailTopicsProps) {
  return (
    <section className="not-prose mt-10 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5">
      <header className="flex items-center gap-2 mb-2">
        <Tag size={16} className="text-blue-600" />
        <h2 className="text-sm font-bold text-gray-900 m-0">{title}</h2>
      </header>
      {intro && (
        <p className="text-xs text-gray-600 leading-relaxed mb-4">{intro}</p>
      )}
      <ul className="flex flex-wrap gap-1.5">
        {terms.map((t) => (
          <li
            key={t}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-default ${accentMap[accent]}`}
          >
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
