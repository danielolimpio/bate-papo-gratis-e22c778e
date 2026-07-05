import { Link } from "react-router-dom";
import { Shield, FileText, Cookie, Heart } from "lucide-react";
import PremiumHeader from "@/components/PremiumHeader";

const navItems = [
  { to: "/politica-de-privacidade", label: "Privacidade", icon: Shield },
  { to: "/termos-de-uso", label: "Termos", icon: FileText },
  { to: "/politica-de-cookies", label: "Cookies", icon: Cookie },
  { to: "/namoro-seguro", label: "Namoro Seguro", icon: Heart },
];

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white legal-content">
      <PremiumHeader variant="light" />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-amber-500 py-16 md:py-20 px-6">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h1>
          <div className="h-1 w-24 bg-white/50 rounded-full mx-auto mt-6" />
        </div>
      </div>

      {/* Navigation pills */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-10">
        <nav className="flex flex-wrap items-center justify-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = typeof window !== "undefined" && window.location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold shadow-lg transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-blue-300/50"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 shadow-gray-300/40 border border-gray-100"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content — wider, premium card */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <article className="bg-white rounded-3xl shadow-[0_10px_60px_-15px_rgba(15,23,42,0.15)] border border-gray-100 p-6 sm:p-10 md:p-14 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" />
          <div className="prose prose-lg prose-slate max-w-none
            [&_p]:text-[17px] [&_p]:leading-[1.85] [&_p]:text-gray-700
            [&_li]:text-[16px] [&_li]:leading-[1.8] [&_li]:text-gray-700
            [&_strong]:text-gray-900
            [&_h2]:text-gray-900 [&_h2]:text-[26px] md:[&_h2]:text-[30px] [&_h2]:font-bold [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-3 [&_h2]:tracking-tight
            [&_h3]:text-gray-900 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3
            [&_.lead]:text-[19px] [&_.lead]:leading-[1.75] [&_.lead]:text-gray-600 [&_.lead]:font-normal [&_.lead]:mb-8">
            {children}
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex flex-wrap items-center justify-center gap-3 mb-4 text-sm">
            {navItems.map((item, i) => (
              <span key={item.to} className="inline-flex items-center gap-1">
                {i > 0 && <span className="text-gray-300 mr-3">·</span>}
                <Link to={item.to} className="text-gray-500 hover:text-blue-600 transition-colors font-medium">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="text-xs text-gray-400 text-center">
            Copyright 2026 | <a href="https://batepapogratis.com" className="hover:text-blue-600 transition-colors">batepapogratis.com</a> | Todos os direitos reservados | Desenvolvido por{" "}
            <a href="https://danielolimpio.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">Daniel Olímpio</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LegalLayout;
