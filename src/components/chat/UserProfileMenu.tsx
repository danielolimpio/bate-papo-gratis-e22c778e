import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Lock, LogOut, Pencil, User, X, Eye, EyeOff } from "lucide-react";
import type { UserProfile } from "@/hooks/useCurrentUser";

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

interface Props {
  profile: UserProfile | null;
  email: string;
  onProfileUpdated: () => void;
}

export default function UserProfileMenu({ profile, email, onProfileUpdated }: Props) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = profile?.avatar_url
    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_url}`
    : null;

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${profile.id}/avatar.${fileExt}`;

    // Remove old avatar if exists
    if (profile.avatar_url) {
      await supabase.storage.from("avatars").remove([profile.avatar_url]);
    }

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (!uploadError) {
      await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", profile.id);
      onProfileUpdated();
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-primary/50 hover:border-primary transition-colors"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Meu perfil" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xs font-bold">
            {profile?.full_name?.charAt(0)?.toUpperCase() || <User size={16} />}
          </div>
        )}
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-chat-divider bg-chat-sidebar shadow-xl overflow-hidden">
            {/* Header with avatar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-chat-divider">
              <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-bold">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{email}</p>
              </div>
            </div>

            <div className="py-1">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); setTimeout(() => fileInputRef.current?.click(), 100); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Camera size={16} className="text-primary" />
                {uploading ? "Enviando..." : "Alterar foto"}
              </button>

              <button
                onClick={() => { setShowMenu(false); setShowEditModal(true); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Pencil size={16} className="text-primary" />
                Editar perfil
              </button>

              <button
                onClick={() => { setShowMenu(false); setShowPasswordModal(true); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Lock size={16} className="text-primary" />
                Trocar senha
              </button>

              <div className="border-t border-chat-divider my-1" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSaved={() => { setShowEditModal(false); onProfileUpdated(); }}
        />
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
      {/* Hidden file input outside dropdown */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUploadAvatar}
      />
    </div>
  );
}

function EditProfileModal({
  profile,
  onClose,
  onSaved,
}: {
  profile: UserProfile;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [age, setAge] = useState(String(profile.age));
  const [gender, setGender] = useState(profile.gender);
  const [relationshipStatus, setRelationshipStatus] = useState(profile.relationship_status);
  const [sexualPreference, setSexualPreference] = useState(profile.sexual_preference);
  const [city, setCity] = useState(profile.city);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!fullName.trim() || !age || !gender || !relationshipStatus || !sexualPreference || !city.trim()) {
      setError("Preencha todos os campos");
      return;
    }
    const ageNum = parseInt(age);
    if (ageNum < 18 || ageNum > 99) {
      setError("Idade deve ser entre 18 e 99 anos");
      return;
    }
    setSaving(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        age: ageNum,
        gender,
        relationship_status: relationshipStatus,
        sexual_preference: sexualPreference,
        city: city.trim(),
      })
      .eq("id", profile.id);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl border border-chat-divider bg-chat-sidebar p-6 shadow-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold text-foreground mb-4">Editar perfil</h2>

        {error && (
          <div className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Nome completo</label>
            <input
              type="text"
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Idade</label>
              <input
                type="number"
                min={18}
                max={99}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Gênero</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
              >
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
                value={relationshipStatus}
                onChange={(e) => setRelationshipStatus(e.target.value)}
                className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
              >
                {relationshipOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Interesse</label>
              <select
                value={sexualPreference}
                onChange={(e) => setSexualPreference(e.target.value)}
                className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
              >
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
              maxLength={100}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Senha atualizada com sucesso!");
      setTimeout(onClose, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="relative w-full max-w-sm rounded-2xl border border-chat-divider bg-chat-sidebar p-6 shadow-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold text-foreground mb-4">Trocar senha</h2>

        {error && (
          <div className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        )}
        {success && (
          <div className="mb-3 rounded-lg bg-online/10 px-3 py-2 text-sm text-online">{success}</div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Nova senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
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
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Confirmar senha</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-chat-divider bg-chat-input-bg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Repita a nova senha"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Atualizando..." : "Atualizar senha"}
        </button>
      </div>
    </div>
  );
}
