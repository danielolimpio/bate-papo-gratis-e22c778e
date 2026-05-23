import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/useTheme";
import logo from "@/assets/logo-batepapo.png";
import { Moon, Sun, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "register";

const relationshipOptions = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "namorando", label: "Namorando" },
  { value: "separado", label: "Separado(a)" },
  { value: "viúvo", label: "Viúvo(a)" },
  { value: "enrolado", label: "Enrolado(a)" },
];

const genderOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "outro", label: "Outro" },
];

const preferenceOptions = [
  { value: "homens", label: "Homens" },
  { value: "mulheres", label: "Mulheres" },
  { value: "ambos", label: "Ambos" },
];

export default function Auth() {
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const initialGender = searchParams.get("gender") || "";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg("");
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotLoading(false);
    if (error) {
      setForgotMsg(error.message);
    } else {
      setForgotMsg("Email enviado! Verifique sua caixa de entrada.");
    }
  };

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(initialGender);
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [sexualPreference, setSexualPreference] = useState("");
  const [city, setCity] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Email ou senha incorretos" : error.message);
    } else {
      navigate("/saladebatepapo");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!fullName || !age || !gender || !relationshipStatus || !sexualPreference || !city) {
      setError("Preencha todos os campos");
      return;
    }
    if (parseInt(age) < 18 || parseInt(age) > 99) {
      setError("Idade deve ser entre 18 e 99 anos");
      return;
    }
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName.trim(),
          age: parseInt(age),
          gender,
          relationship_status: relationshipStatus,
          sexual_preference: sexualPreference,
          city: city.trim(),
        },
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSuccess("Cadastro realizado! Verifique seu email para confirmar a conta.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-chat-bg px-4">
      <Helmet>
        <title>Login e Cadastro — Bate-Papo Grátis</title>
        <meta name="description" content="Entre na sua conta ou cadastre-se gratuitamente no Bate-Papo Grátis. Comece a conversar e fazer amizades agora." />
        <link rel="canonical" href="/auth" />
      </Helmet>
      {/* Theme toggle */}
      <button
        onClick={toggle}
        aria-label="Alternar tema"
        className="fixed top-4 right-4 rounded-full p-2 hover:bg-secondary transition-colors z-10"
      >
        {isDark ? <Sun size={18} className="text-foreground" /> : <Moon size={18} className="text-foreground" />}
      </button>

      <div className="w-full max-w-md">
        <h1 className="sr-only">Login e Cadastro — Bate-Papo Grátis</h1>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Bate-Papo Grátis" className="h-12" />
        </div>

        <div className="rounded-2xl border border-chat-divider bg-chat-sidebar p-6 shadow-lg">
          {/* Tabs */}
          <div className="flex mb-6 rounded-xl bg-chat-input-bg p-1">
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cadastrar
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-online/10 px-3 py-2 text-sm text-online">{success}</div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="auth-email" className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label htmlFor="auth-password" className="block text-xs font-medium text-muted-foreground mb-1">Senha</label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="w-full text-center text-xs text-primary hover:underline mt-2"
              >
                Esqueceu sua senha?
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label htmlFor="auth-fullName" className="block text-xs font-medium text-muted-foreground mb-1">Nome completo</label>
                <input
                  id="auth-fullName"
                  type="text"
                  required
                  maxLength={100}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Maria da Silva"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="auth-age" className="block text-xs font-medium text-muted-foreground mb-1">Idade</label>
                  <input
                    id="auth-age"
                    type="number"
                    required
                    min={18}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label htmlFor="auth-gender" className="block text-xs font-medium text-muted-foreground mb-1">Gênero</label>
                  <select
                    id="auth-gender"
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Selecione</option>
                    {genderOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="auth-relationship" className="block text-xs font-medium text-muted-foreground mb-1">Estado civil</label>
                  <select
                    id="auth-relationship"
                    required
                    value={relationshipStatus}
                    onChange={(e) => setRelationshipStatus(e.target.value)}
                    className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Selecione</option>
                    {relationshipOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="auth-preference" className="block text-xs font-medium text-muted-foreground mb-1">Interesse</label>
                  <select
                    id="auth-preference"
                    required
                    value={sexualPreference}
                    onChange={(e) => setSexualPreference(e.target.value)}
                    className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Selecione</option>
                    {preferenceOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Cidade</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Cadastrando..." : "Criar conta"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ao se cadastrar, você concorda com os Termos de Uso e Política de Privacidade do Bate-Papo Grátis.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-chat-divider bg-chat-sidebar p-6 shadow-xl">
            <h2 className="text-lg font-bold text-foreground mb-2">Recuperar Senha</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Digite seu email cadastrado. Enviaremos um link para redefinir sua senha.
            </p>
            {forgotMsg && (
              <div className={`mb-4 rounded-lg px-3 py-2 text-sm ${forgotMsg.includes("enviado") ? "bg-online/10 text-online" : "bg-destructive/10 text-destructive"}`}>
                {forgotMsg}
              </div>
            )}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowForgot(false); setForgotMsg(""); }}
                  className="flex-1 rounded-lg border border-chat-divider py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {forgotLoading ? "Enviando..." : "Enviar Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
