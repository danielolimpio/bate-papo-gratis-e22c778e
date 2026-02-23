import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface Props {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const categories = [
  {
    name: "Carinhas e pessoas",
    icon: "😊",
    emojis: [
      "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃",
      "😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙",
      "😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔",
      "🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥",
      "😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮",
      "🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐",
      "😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧",
      "😨","😰","😥","😢","😭","😱","😖","😣","😞","😓",
      "😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀",
      "💩","🤡","👹","👺","👻","👽","👾","🤖"
    ]
  },
  {
    name: "Gestos e corpo",
    icon: "👋",
    emojis: [
      "👋","🤚","✋","🖖","👌","🤌","🤏","✌","🤞","🤟",
      "🤘","🤙","👈","👉","👆","🖕","👇","☝","👍","👎",
      "✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏",
      "💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃",
      "🧠","🦷","🦴","👀","👅","👄","👶","👧","🧒","👦",
      "👩","🧑","👨","👱","🧔","👵","🧓","👴","👲","🧕"
    ]
  },
  {
    name: "Animais e natureza",
    icon: "🐶",
    emojis: [
      "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
      "🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧",
      "🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄",
      "🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷","🦂",
      "🐢","🐍","🦎","🐙","🦑","🦐","🦀","🐡","🐠","🐟",
      "🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🐘",
      "🌸","🌺","🌻","🌹","🌷","🌼","💐","🌿","🍀","🍁",
      "🍂","🍃","🌱","🌲","🌳","🌴","🌵","🌾","🍄","🌰"
    ]
  },
  {
    name: "Comida e bebida",
    icon: "🍔",
    emojis: [
      "🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒",
      "🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬",
      "🥒","🌶","🌽","🥕","🧄","🧅","🥔","🍠","🍔","🍟",
      "🍕","🌭","🥪","🌮","🌯","🥙","🧆","🥗","🍝","🍜",
      "🍲","🍛","🍣","🍱","🥟","🍤","🍩","🍪","🎂","🍰",
      "🧁","🥧","🍫","🍬","🍭","🍮","🍯","☕","🍵","🧃",
      "🥤","🍶","🍺","🍻","🥂","🍷","🍸","🍹","🍾","🥃"
    ]
  },
  {
    name: "Atividades",
    icon: "⚽",
    emojis: [
      "⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱",
      "🏓","🏸","🏒","🏑","🥍","🏏","🥅","⛳","🏹","🎣",
      "🤿","🥊","🥋","🎽","🛹","🛷","🥌","🎿","🏂","🏋",
      "🤸","🤼","🤺","🎯","🎳","🎮","🕹","🎲","🧩","🎭",
      "🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸",
      "🎻","🏆","🏅","🥇","🥈","🥉","🎖","🎗","🎪","🎠"
    ]
  },
  {
    name: "Corações e símbolos",
    icon: "❤",
    emojis: [
      "❤","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔",
      "💕","💞","💓","💗","💖","💘","💝","💟","💯","💢",
      "💥","💫","💦","💨","💣","💬","💭","💤","🔥","⭐",
      "🌟","✨","🎉","🎊","🎈","🎁","📱","💻","🖥","📷",
      "🎥","📞","📺","📻","🔔","🔕","🔊","🔉","🔈","🔇",
      "📣","📢","👑","💎","💍","👗","👠","👡","👢","🧢"
    ]
  }
];

export default function EmojiPicker({ onSelect, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const filtered = search.trim()
    ? categories.map(c => ({
        ...c,
        emojis: c.emojis.filter(() => {
          // Simple search: show all when typing (native emoji search is limited)
          return true;
        })
      }))
    : categories;

  return (
    <div
      ref={ref}
      className="absolute bottom-14 left-2 z-50 w-[340px] rounded-xl border border-chat-divider bg-chat-sidebar shadow-2xl overflow-hidden"
    >
      {/* Search */}
      <div className="p-2 border-b border-chat-divider">
        <div className="flex items-center gap-2 rounded-full bg-chat-input-bg px-3 py-1.5">
          <Search size={14} className="text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar emoji"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Emoji grid */}
      <div className="h-[280px] overflow-y-auto px-2 py-1 scrollbar-thin">
        {filtered.map((cat, ci) => (
          <div key={ci} id={`emoji-cat-${ci}`}>
            <p className="text-xs text-muted-foreground font-medium px-1 py-1.5 sticky top-0 bg-chat-sidebar z-10">
              {cat.name}
            </p>
            <div className="grid grid-cols-8 gap-0.5">
              {cat.emojis.map((emoji, ei) => (
                <button
                  key={ei}
                  onClick={() => { onSelect(emoji); onClose(); }}
                  className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-[22px] leading-none"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex items-center justify-around border-t border-chat-divider px-1 py-1 bg-chat-sidebar">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveCategory(i);
              document.getElementById(`emoji-cat-${i}`)?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`h-8 w-8 flex items-center justify-center rounded-lg text-lg transition-colors ${
              activeCategory === i ? "bg-secondary" : "hover:bg-secondary/50"
            }`}
          >
            {cat.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
