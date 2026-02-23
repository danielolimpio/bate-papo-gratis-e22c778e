import { Link } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-4 px-6">
        <Link to="/" className="inline-block">
          <img src={logoDark} alt="WoomChat" className="h-10" />
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h1>
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
          {children}
        </div>
      </main>
      <footer className="border-t border-gray-200 py-6 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-4 mb-3 text-sm text-gray-500">
          <Link to="/politica-de-privacidade" className="hover:text-gray-800 transition-colors">Política de Privacidade</Link>
          <span>|</span>
          <Link to="/termos-de-uso" className="hover:text-gray-800 transition-colors">Termos de Uso</Link>
          <span>|</span>
          <Link to="/politica-de-cookies" className="hover:text-gray-800 transition-colors">Política de Cookies</Link>
          <span>|</span>
          <Link to="/quem-somos" className="hover:text-gray-800 transition-colors">Quem Somos</Link>
          <span>|</span>
          <Link to="/namoro-seguro" className="hover:text-gray-800 transition-colors">Namoro Seguro</Link>
        </nav>
        <p className="text-xs text-gray-400">
          Copyright 2026 | <a href="https://woomchat.com">Woomchat.com</a> | Todos os direitos reservados | Desenvolvido por{" "}
          <a href="https://danielolimpio.com" target="_blank" rel="noopener noreferrer" className="underline">Daniel Olímpio</a>
        </p>
      </footer>
    </div>
  );
}

export default LegalLayout;
