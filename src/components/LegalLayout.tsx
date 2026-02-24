import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Cookie, Users, Heart } from "lucide-react";
import logoLight from "@/assets/logo-light.png";

const navItems = [
  { to: "/politica-de-privacidade", label: "Privacidade", icon: Shield },
  { to: "/termos-de-uso", label: "Termos", icon: FileText },
  { to: "/politica-de-cookies", label: "Cookies", icon: Cookie },
  { to: "/quem-somos", label: "Quem Somos", icon: Users },
  { to: "/namoro-seguro", label: "Namoro Seguro", icon: Heart },
];

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Voltar
          </Link>
          <Link to="/" className="inline-block">
            <img src={logoLight} alt="WoomChat" className="h-9" />
          </Link>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{title}</h1>
          <div className="h-1 w-16 bg-white/40 rounded-full mx-auto mt-4" />
        </div>
      </div>

      {/* Navigation pills */}
      <div className="max-w-5xl mx-auto px-6 -mt-5">
        <nav className="flex flex-wrap items-center justify-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = typeof window !== "undefined" && window.location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-md transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-emerald-200"
                    : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-gray-200/60"
                }`}
              >
                <Icon size={13} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed [&_h2]:text-gray-900 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex flex-wrap items-center justify-center gap-3 mb-4 text-sm">
            {navItems.map((item, i) => (
              <span key={item.to} className="inline-flex items-center gap-1">
                {i > 0 && <span className="text-gray-300 mr-3">·</span>}
                <Link to={item.to} className="text-gray-500 hover:text-emerald-600 transition-colors font-medium">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="text-xs text-gray-400 text-center">
            Copyright 2026 | <a href="https://woomchat.com" className="hover:text-emerald-600 transition-colors">Woomchat.com</a> | Todos os direitos reservados | Desenvolvido por{" "}
            <a href="https://danielolimpio.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-600 transition-colors">Daniel Olímpio</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LegalLayout;
