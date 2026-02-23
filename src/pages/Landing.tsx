import { useNavigate } from "react-router-dom";
import heroCouple from "@/assets/hero-couple.jpg";
import logoDark from "@/assets/logo-dark.png";

export default function Landing() {
  const navigate = useNavigate();

  const handleGenderSelect = (gender: string) => {
    navigate(`/auth?mode=register&gender=${gender}`);
  };

  return (
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
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        {/* Logo */}
        <img src={logoDark} alt="WoomChat" className="h-14 mb-8 drop-shadow-lg" />

        {/* Gender selection card */}
        <div className="w-full max-w-sm rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            Você é
          </h2>

          <button
            onClick={() => handleGenderSelect("masculino")}
            className="w-full mb-4 rounded-full bg-red-500 py-3.5 text-base font-semibold text-white hover:bg-red-600 transition-colors"
          >
            Homem
          </button>

          <button
            onClick={() => handleGenderSelect("feminino")}
            className="w-full mb-6 rounded-full bg-red-500 py-3.5 text-base font-semibold text-white hover:bg-red-600 transition-colors"
          >
            Mulher
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
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-4 mb-3 text-sm text-white/80">
          <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          <span className="text-white/40">|</span>
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          <span className="text-white/40">|</span>
          <a href="#" className="hover:text-white transition-colors">Política de Cookies</a>
          <span className="text-white/40">|</span>
          <a href="#" className="hover:text-white transition-colors">Quem Somos</a>
          <span className="text-white/40">|</span>
          <a href="#" className="hover:text-white transition-colors">Namoro Seguro</a>
        </nav>
        <p className="text-xs text-white/60">
          Copyright 2026 |{" "}
          <a href="https://woomchat.com" className="hover:text-white transition-colors">Woomchat.com</a>
          {" "}| Todos os direitos reservados | Desenvolvido por{" "}
          <a href="https://danielolimpio.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">
            Daniel Olímpio
          </a>
        </p>
      </footer>
    </div>
  );
}
