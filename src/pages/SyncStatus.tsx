import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Smartphone,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAutoResync } from "@/hooks/useAutoResync";
import { emitSync, getBackoff, resetBackoff } from "@/lib/syncBus";

interface Snapshot {
  profileFilled: boolean;
  groupCount: number;
  groupMemberCount: number;
  matchCount: number;
  conversationCount: number;
  messageCount: number;
  reactionCount: number;
  takenAt: number;
}

interface DeviceRecord {
  deviceId: string;
  deviceLabel: string;
  snapshot: Snapshot;
}

const LS_KEY = "lovable.syncReport.devices.v1";
const DEVICE_ID_KEY = "lovable.syncReport.deviceId";

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function getDeviceLabel() {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  const platform =
    /Android/i.test(ua) ? "Android"
    : /iPhone|iPad|iPod/i.test(ua) ? "iOS"
    : /Mac/i.test(ua) ? "Mac"
    : /Windows/i.test(ua) ? "Windows"
    : /Linux/i.test(ua) ? "Linux"
    : "Desconhecido";
  return `${isMobile ? "Celular" : "Desktop"} • ${platform}`;
}

function loadDevices(): Record<string, DeviceRecord[]> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveDevice(userKey: string, record: DeviceRecord) {
  const all = loadDevices();
  const list = (all[userKey] || []).filter((d) => d.deviceId !== record.deviceId);
  list.push(record);
  all[userKey] = list;
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

async function takeSnapshot(userId: string): Promise<Snapshot> {
  const [
    profileRes,
    groupsRes,
    matchesRes,
    convsRes,
    messagesRes,
    reactionsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id, full_name, age, gender, city").eq("id", userId).maybeSingle(),
    supabase.from("groups").select("id").eq("created_by", userId),
    supabase.from("user_matches").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("user_conversations").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("message_reactions").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  let memberCount = 0;
  const groupIds = (groupsRes.data || []).map((g: any) => g.id);
  if (groupIds.length) {
    const { count } = await supabase
      .from("group_members")
      .select("id", { count: "exact", head: true })
      .in("group_id", groupIds);
    memberCount = count ?? 0;
  }

  const profile = profileRes.data as any;
  const profileFilled = Boolean(
    profile && profile.full_name && profile.age && profile.gender && profile.city
  );

  return {
    profileFilled,
    groupCount: groupIds.length,
    groupMemberCount: memberCount,
    matchCount: matchesRes.count ?? 0,
    conversationCount: convsRes.count ?? 0,
    messageCount: messagesRes.count ?? 0,
    reactionCount: reactionsRes.count ?? 0,
    takenAt: Date.now(),
  };
}

const KEYS: { key: keyof Snapshot; label: string }[] = [
  { key: "groupCount", label: "Grupos" },
  { key: "groupMemberCount", label: "Membros em grupos" },
  { key: "matchCount", label: "Matches" },
  { key: "conversationCount", label: "Conversas privadas" },
  { key: "messageCount", label: "Mensagens enviadas" },
  { key: "reactionCount", label: "Reações" },
];

export default function SyncStatus() {
  useAutoResync();
  const { user, profile } = useCurrentUser();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const deviceId = useMemo(() => getDeviceId(), []);
  const deviceLabel = useMemo(() => getDeviceLabel(), []);

  const userKey = user?.email || user?.id || "anon";

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await takeSnapshot(user.id);
      setSnapshot(snap);
      saveDevice(userKey, { deviceId, deviceLabel, snapshot: snap });
      const all = loadDevices();
      setDevices(all[userKey] || []);
      resetBackoff();
    } finally {
      setLoading(false);
    }
  }, [user, userKey, deviceId, deviceLabel]);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const otherDevices = devices.filter((d) => d.deviceId !== deviceId);

  const computeDivergences = (other: Snapshot) => {
    if (!snapshot) return [];
    return KEYS.filter(({ key }) => snapshot[key] !== other[key]).map(({ key, label }) => ({
      label,
      here: snapshot[key] as number,
      there: other[key] as number,
      missing: (snapshot[key] as number) - (other[key] as number),
    }));
  };

  const allInSync =
    snapshot &&
    otherDevices.length > 0 &&
    otherDevices.every((d) => computeDivergences(d.snapshot).length === 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-3">
          <p>Faça login para ver o status de sincronização.</p>
          <Link to="/auth" className="text-primary underline">Entrar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Status de Sincronização — Bate-Papo Grátis</title>
        <meta name="description" content="Verifique se seus dados estão sincronizados entre dispositivos no Bate-Papo Grátis." />
        <link rel="canonical" href="/status-sincronizacao" />
        <meta property="og:title" content="Status de Sincronização — Bate-Papo Grátis" />
        <meta property="og:description" content="Verifique se seus dados estão sincronizados entre dispositivos no Bate-Papo Grátis." />
        <meta property="og:url" content="https://batepapogratis.com/status-sincronizacao" />
        <meta property="og:type" content="website" />
      </Helmet>
      <header className="border-b border-chat-divider px-4 py-3 flex items-center justify-between">
        <Link to="/saladebatepapo" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Voltar para o chat
        </Link>
        <button
          onClick={() => {
            emitSync("manual");
            refresh();
          }}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Forçar sincronização
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <section>
          <h1 className="text-xl font-bold mb-1">Status de Sincronização</h1>
          <p className="text-sm text-muted-foreground">
            Conta: <span className="text-foreground font-medium">{user.email}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Re-sync automático com backoff: {Math.round(getBackoff() / 1000)}s
          </p>
        </section>

        {/* Current device snapshot */}
        <section className="rounded-xl border border-chat-divider bg-chat-sidebar p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-primary" />
              <h2 className="font-semibold text-sm">Este dispositivo</h2>
            </div>
            <span className="text-xs text-muted-foreground">{deviceLabel}</span>
          </div>
          {snapshot ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <SyncRow ok={snapshot.profileFilled} label="Perfil completo" value={snapshot.profileFilled ? "OK" : "Incompleto"} />
              {KEYS.map(({ key, label }) => (
                <SyncRow key={key} ok value={String(snapshot[key])} label={label} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          )}
        </section>

        {/* Divergence report */}
        <section className="rounded-xl border border-chat-divider bg-chat-sidebar p-4">
          <h2 className="font-semibold text-sm mb-3">Relatório de Divergências</h2>
          {otherDevices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum outro dispositivo registrado ainda. Abra esta página em outro
              dispositivo logado com o mesmo e-mail para comparar.
            </p>
          ) : allInSync ? (
            <div className="flex items-center gap-2 text-sm text-online">
              <CheckCircle2 size={16} /> Tudo sincronizado entre os dispositivos.
            </div>
          ) : (
            <div className="space-y-4">
              {otherDevices.map((d) => {
                const divs = computeDivergences(d.snapshot);
                return (
                  <div key={d.deviceId} className="rounded-lg border border-chat-divider p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{d.deviceLabel}</span>
                      <span className="text-[11px] text-muted-foreground">
                        snapshot {new Date(d.snapshot.takenAt).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    {divs.length === 0 ? (
                      <p className="text-xs text-online flex items-center gap-1">
                        <CheckCircle2 size={12} /> Sincronizado
                      </p>
                    ) : (
                      <ul className="space-y-1 text-xs">
                        {divs.map((d2) => (
                          <li key={d2.label} className="flex items-center gap-2">
                            <AlertTriangle size={12} className="text-yellow-500" />
                            <span className="font-medium">{d2.label}:</span>
                            <span>aqui {d2.here} ↔ lá {d2.there}</span>
                            <span className="text-muted-foreground">
                              ({d2.missing > 0 ? `faltam ${d2.missing} no outro` : `faltam ${-d2.missing} aqui`})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="text-xs text-muted-foreground">
          <p>
            As contagens são lidas direto do banco compartilhado. Se houver divergência
            persistente após forçar a sincronização, é porque os dispositivos estão
            logados em contas diferentes ou a tabela ainda não replicou — aguarde alguns
            segundos e tente novamente.
          </p>
        </section>
      </main>
    </div>
  );
}

function SyncRow({ ok, label, value }: { ok: boolean; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-background/40 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 text-sm font-semibold">
        {ok ? <CheckCircle2 size={14} className="text-online" /> : <XCircle size={14} className="text-destructive" />}
        {value}
      </span>
    </div>
  );
}
