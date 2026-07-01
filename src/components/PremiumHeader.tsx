import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import logo from "@/assets/logo-batepapo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/quem-somos", label: "Quem Somos" },
  { to: "/bate-papo-sem-cadastro", label: "Bate-Papo Sem Cadastro" },
  { to: "/sala-de-bate-papo", label: "Sala de Bate-Papo" },
  { to: "/chat-gratis", label: "Chat Grátis" },
  { to: "/bate-papo-webcam", label: "Bate-Papo Webcam" },
  { to: "/bate-papo-amizade-namoro", label: "Amizade e Namoro" },
];

interface PremiumHeaderProps {
  variant?: "dark" | "light";
}

export default function PremiumHeader({ variant = "light" }: PremiumHeaderProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = variant === "dark";

  const baseText = isDark ? "text-white/90" : "text-gray-600";
  const hoverText = isDark ? "hover:text-white" : "hover:text-blue-600";
  const activeText = isDark ? "text-white" : "text-blue-600";
  const activeBg = isDark ? "bg-white/20" : "bg-blue-50";
  const logoFilter = isDark ? "brightness-0 invert" : "";
  const borderColor = isDark ? "border-white/10" : "border-gray-100";
  const bgClass = isDark
    ? "bg-black/30 backdrop-blur-md"
    : "bg-white/90 backdrop-blur-md";

  return (
    <header
      className={`${isDark ? "absolute top-0 left-0 right-0 z-50" : "sticky top-0 z-50"} lg:border-b lg:${borderColor} ${bgClass} max-lg:!bg-transparent max-lg:!border-0 max-lg:!backdrop-blur-0`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop bar */}
        <div className="hidden lg:flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="Bate-Papo Grátis"
              className={`h-8 ${logoFilter}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? `${activeText} ${activeBg}`
                      : `${baseText} ${hoverText}`
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile: floating hamburger only, no header bar */}
        <div className="lg:hidden absolute top-3 right-3 z-50">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Abrir menu"
                className={`p-2 rounded-lg backdrop-blur-md shadow-md transition-colors ${
                  isDark
                    ? "bg-black/40 text-white hover:bg-black/60"
                    : "bg-white/90 text-gray-700 hover:bg-white"
                }`}
                >
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className={`w-[280px] sm:w-[320px] ${
                  isDark ? "bg-gray-900 border-gray-800" : "bg-white"
                }`}
              >
                <div className="flex flex-col h-full pt-2">
                  <div className="flex items-center justify-between mb-8">
                    <img
                      src={logo}
                      alt="Bate-Papo Grátis"
                      className={`h-8 ${isDark ? "brightness-0 invert" : ""}`}
                    />
                    <SheetClose asChild>
                      <button
                        aria-label="Fechar menu"
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "text-white/70 hover:bg-white/10"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <X size={20} />
                      </button>
                    </SheetClose>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => {
                      const isActive = location.pathname === link.to;
                      return (
                        <SheetClose key={link.to} asChild>
                          <Link
                            to={link.to}
                            onClick={() => setMobileOpen(false)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                              isActive
                                ? isDark
                                  ? "bg-blue-600/20 text-blue-400"
                                  : "bg-blue-50 text-blue-600"
                                : isDark
                                ? "text-gray-300 hover:bg-white/5 hover:text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
