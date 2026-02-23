import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/useTheme";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
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
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
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
      navigate("/");
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
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }
    // Insert profile
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName.trim(),
        age: parseInt(age),
        gender,
        relationship_status: relationshipStatus,
        sexual_preference: sexualPreference,
        city: city.trim(),
      });
      if (profileError) {
        setLoading(false);
        setError("Erro ao criar perfil: " + profileError.message);
        return;
      }
    }
    setLoading(false);
    setSuccess("Cadastro realizado! Verifique seu email para confirmar a conta.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-chat-bg px-4">
      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="fixed top-4 right-4 rounded-full p-2 hover:bg-secondary transition-colors z-10"
      >
        {isDark ? <Sun size={18} className="text-foreground" /> : <Moon size={18} className="text-foreground" />}
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={isDark ? logoDark : logoLight} alt="WoomChat" className="h-12" />
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
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
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
                    className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                    placeholder="••••••"
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
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Nome completo</label>
                <input
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
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Idade</label>
                  <input
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
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Gênero</label>
                  <select
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
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Estado civil</label>
                  <select
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
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Interesse</label>
                  <select
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
          Ao se cadastrar, você concorda com os Termos de Uso e Política de Privacidade do WoomChat.
        </p>
      </div>
    </div>
  );
}
