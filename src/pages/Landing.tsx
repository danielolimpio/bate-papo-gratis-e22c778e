import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import heroCouple from "@/assets/hero-couple.jpg";
import logo from "@/assets/logo-batepapo.png";

export default function Landing() {
  const navigate = useNavigate();

  const handleGenderSelect = (gender: string) => {
    navigate(`/auth?mode=register&gender=${gender}`);
  };

  return (
    <>
      <Helmet>
        <title>Bate-Papo Grátis — Sala de Conversa e Amizades Online</title>
        <meta name="description" content="Sala de bate-papo online gratuita para conversar e fazer novas amizades em tempo real. Encontre pessoas especiais." />
        <link rel="canonical" href="/" />
        <meta property="og:title" content="Bate-Papo Grátis — Sala de Conversa e Amizades Online" />
        <meta property="og:description" content="Sala de bate-papo online gratuita para conversar e fazer novas amizades em tempo real." />
        <meta property="og:url" content="/" />
      </Helmet>
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Hero background - full screen */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroCouple}
          alt="Casal feliz"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 md:justify-start md:px-0">
        <div className="flex flex-col items-center w-full md:w-1/2">
          {/* Logo */}
          <img src={logo} alt="Bate-Papo Grátis" className="h-14 mb-3 drop-shadow-lg" />

          {/* Tagline below logo */}
          <p className="text-white text-2xl md:text-3xl mb-8 drop-shadow-md text-center" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Entre para a Sala de Bate-Papo!
          </p>

          {/* Gender selection card */}
          <div className="w-full max-w-sm rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
            <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
              Você é
            </h2>

            <button
              onClick={() => handleGenderSelect("masculino")}
              className="group relative w-full mb-4 overflow-hidden rounded-full py-3.5 text-base font-semibold text-white transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(37,99,235,0.55)] hover:shadow-[0_14px_36px_-8px_rgba(37,99,235,0.75)] hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 bg-[length:200%_200%] hover:bg-[position:100%_0%]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Homem</span>
            </button>

            <button
              onClick={() => handleGenderSelect("feminino")}
              className="group relative w-full mb-6 overflow-hidden rounded-full py-3.5 text-base font-semibold text-white transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(245,158,11,0.55)] hover:shadow-[0_14px_36px_-8px_rgba(245,158,11,0.75)] hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 bg-[length:200%_200%] hover:bg-[position:100%_0%]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Mulher</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500">ou</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <button
              onClick={() => navigate("/auth?mode=login")}
              className="w-full rounded-full border-2 border-gray-300 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Fazer Login
            </button>
          </div>

          {/* Free environment text */}
          <p className="mt-5 text-white text-base font-medium drop-shadow-md tracking-wide flex items-center justify-center gap-1.5">
            <span className="inline-block animate-[heartbeat_1.4s_ease-in-out_infinite] text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]">💚</span>
            Ambiente 100% gratuito.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-4 mb-3 text-sm text-white/80">
          <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
          <span className="text-white/40">|</span>
          <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
          <span className="text-white/40">|</span>
          <Link to="/politica-de-cookies" className="hover:text-white transition-colors">Política de Cookies</Link>
          <span className="text-white/40">|</span>
          <Link to="/quem-somos" className="hover:text-white transition-colors">Quem Somos</Link>
          <span className="text-white/40">|</span>
          <Link to="/namoro-seguro" className="hover:text-white transition-colors">Namoro Seguro</Link>
        </nav>
        <p className="text-xs text-white/60">
          Copyright 2026 |{" "}
          <a href="https://batepapogratis.com" className="hover:text-white transition-colors">batepapogratis.com</a>
          {" "}| Todos os direitos reservados | Desenvolvido por{" "}
          <a href="https://danielolimpio.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">
            Daniel Olímpio
          </a>
        </p>
      </footer>
    </div>
  );
}
