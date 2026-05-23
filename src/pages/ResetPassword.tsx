import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/useTheme";
import logo from "@/assets/logo-batepapo.png";
import { Moon, Sun, Eye, EyeOff, Lock } from "lucide-react";

export default function ResetPassword() {
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Check URL hash for recovery type
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Senha alterada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/saladebatepapo"), 2000);
    }
  };

  if (!isRecovery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chat-bg px-4">
        <Helmet>
          <title>Redefinir Senha — Bate-Papo Grátis</title>
          <meta name="description" content="Recupere o acesso à sua conta redefinindo sua senha de forma segura." />
          <link rel="canonical" href="/reset-password" />
        </Helmet>
      <button onClick={toggle} aria-label="Alternar tema" className="fixed top-4 right-4 rounded-full p-2 hover:bg-secondary transition-colors z-10">
        {isDark ? <Sun size={18} className="text-foreground" /> : <Moon size={18} className="text-foreground" />}
      </button>
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Bate-Papo Grátis" className="h-12" />
          </div>
          <div className="rounded-2xl border border-chat-divider bg-chat-sidebar p-6 shadow-lg">
            <Lock className="mx-auto mb-4 text-primary" size={40} />
            <h1 className="text-lg font-bold text-foreground mb-2">Link inválido ou expirado</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Este link de recuperação de senha é inválido ou já foi utilizado. Solicite um novo link.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Voltar para Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-chat-bg px-4">
      <Helmet>
        <title>Redefinir Senha — Bate-Papo Grátis</title>
        <meta name="description" content="Recupere o acesso à sua conta redefinindo sua senha de forma segura." />
        <link rel="canonical" href="/reset-password" />
      </Helmet>
      <button onClick={toggle} aria-label="Alternar tema" className="fixed top-4 right-4 rounded-full p-2 hover:bg-secondary transition-colors z-10">
        {isDark ? <Sun size={18} className="text-foreground" /> : <Moon size={18} className="text-foreground" />}
      </button>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Bate-Papo Grátis" className="h-12" />
        </div>
        <div className="rounded-2xl border border-chat-divider bg-chat-sidebar p-6 shadow-lg">
          <h1 className="text-lg font-bold text-foreground mb-1 text-center">Redefinir Senha</h1>
          <p className="text-sm text-muted-foreground mb-5 text-center">Digite sua nova senha abaixo.</p>

          {error && <div className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
          {success && <div className="mb-4 rounded-lg bg-online/10 px-3 py-2 text-sm text-online">{success}</div>}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Nova senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                  placeholder="Mínimo 6 caracteres"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Confirmar nova senha</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Repita a senha"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Redefinir Senha"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
