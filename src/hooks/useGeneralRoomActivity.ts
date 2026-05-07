import { useEffect, useRef, useState, useCallback } from "react";
import { users } from "@/data/mockData";
import type { ChatMessage } from "./useMessages";

export interface TypingUser {
  id: string;
  name: string;
  avatar: string;
}

/**
 * NOVA ARQUITETURA — Conversas naturais por TÓPICO (bloco de 30 min).
 *
 * Cada bloco de 30 min escolhe deterministicamente UM tópico relevante para
 * o período/dia/feriado. O tópico contém um roteiro de 4–6 falas conectadas
 * (introdução, perguntas, reações, follow-ups). Os participantes saem de um
 * pool de 4–6 perfis fictícios; alguns repetem dentro do mesmo bloco para
 * parecer interação real.
 */

type Period = "m" | "a" | "e" | "n";

interface Topic {
  id: string;
  periods?: Period[];
  days?: number[]; // 0..6
  holidays?: string[];
  /** 4–6 falas conectadas, ordenadas */
  lines: string[];
  /** peso relativo (default 1) */
  weight?: number;
}

const TOPICS: Topic[] = [
  // ============== MANHÃ ==============
  {
    id: "cafe_manha",
    periods: ["m"],
    lines: [
      "bom diaaa galera ☀️",
      "bom dia! tô tomando café aqui ☕",
      "café puro ou com leite? rs",
      "puro, sem açúcar tbm",
      "eu só funciono depois do segundo kkk",
      "concordo demais, hoje vou precisar de 3",
    ],
  },
  {
    id: "trampo_manha",
    periods: ["m"],
    days: [1, 2, 3, 4, 5],
    lines: [
      "indo pro trampo, q preguiça",
      "te entendo, hj acordei mt mal",
      "alguém aqui já tá no escritório?",
      "eu, cheguei agora e já com reunião marcada",
      "boa sorte, vai render",
      "obrigada amore ❤️",
    ],
  },
  {
    id: "manha_natureza",
    periods: ["m"],
    lines: [
      "vi o sol nascer hj, raro 🌄",
      "que sorte! aqui tá nublado",
      "amo manhã fresquinha, bom pra caminhar",
      "saí pra correr 5km, voltei renovada",
      "queria essa disciplina, parabéns",
      "começa devagar, qq ritmo conta",
    ],
  },
  {
    id: "monday_blues",
    periods: ["m"],
    days: [1],
    lines: [
      "odeio acordar segunda 😭",
      "segunda me acaba mds",
      "alguém sentindo isso ou só eu?",
      "todo mundo sente, calma kk",
      "café duplo já pra hj",
      "vamoo, força galera 💪",
    ],
  },

  // ============== TARDE ==============
  {
    id: "almoco",
    periods: ["a"],
    lines: [
      "alguém almoçou já? eu tô morrendo de fome",
      "acabei de comer, fiz um arroz com feijão simples",
      "feijão de panela é vida né",
      "sempreee, com farofa então 😋",
      "tô indo agora pro restaurante aqui",
      "manda foto depois 🍽️",
    ],
  },
  {
    id: "tarde_trabalho",
    periods: ["a"],
    days: [1, 2, 3, 4, 5],
    lines: [
      "que tarde longaaa",
      "o relógio para né, jura",
      "tô fingindo q tô trabalhando aqui kk",
      "kkkk situação",
      "chefe acabou de passar, susto",
      "aff respeita ngm",
    ],
  },
  {
    id: "cafe_tarde",
    periods: ["a"],
    lines: [
      "hora do cafezinho da tarde ☕",
      "eu já tô no segundo viu",
      "biscoito com café é vida ❤️",
      "pão de queijo quentinho seria perfeito agora",
      "para com isso, fiquei com fome",
      "kkkk desculpa galera",
    ],
  },
  {
    id: "por_do_sol",
    periods: ["a", "e"],
    lines: [
      "que pôr do sol lindo hj 🌅",
      "fui na janela ver, ficou muito rosa o céu",
      "esse fim de tarde tá uma poesia",
      "amo essa hora do dia 💕",
      "manda foto se conseguir",
      "já mandei pra todo mundo do whats kkk",
    ],
  },

  // ============== NOITE ==============
  {
    id: "happy_hour",
    periods: ["e"],
    lines: [
      "alguém pra um chopp virtual? 🍺",
      "to dentro! cervejinha gelada aqui",
      "vinho e Netflix, meu happy hour kk",
      "porção de batata frita salvou o dia 🍟",
      "para com isso vou pedir agora",
      "manda lá, hj é dia de relaxar",
    ],
  },
  {
    id: "sextou",
    periods: ["e"],
    days: [5],
    lines: [
      "SEXTOOOOU 🎉",
      "finalmente sexta, q semanaaa",
      "alguém vai sair hj?",
      "vou no bar com a galera, vc?",
      "eu vou ficar em casa msm, exausta",
      "respeita o cansaço, amanhã tem fds inteiro 💕",
    ],
  },
  {
    id: "musica_noite",
    periods: ["e"],
    lines: [
      "alguém ouvindo música? indica aí",
      "to ouvindo Marisa Monte 🎶",
      "amo Marisa, clássica demais",
      "Djavan no repeat aqui",
      "Caetano sempre salva qq dia",
      "amei as indicações, vou montar uma playlist",
    ],
  },
  {
    id: "janta",
    periods: ["e"],
    lines: [
      "vou fazer janta, ideias?",
      "macarrão alho e óleo, simples e bom",
      "fiz lasanha hj, tá divina",
      "que vontade agora kkkk",
      "pizza sempre salva 🍕",
      "fechou, vou pedir pizza então",
    ],
  },
  {
    id: "serie_filme",
    periods: ["e", "n"],
    lines: [
      "alguém viu uma série boa recente?",
      "to vendo um dorama, viciei",
      "qual dorama? to precisando de uma indicação",
      "Crash Landing on You, chora muito mas vale",
      "anotei! e filme alguém indica?",
      "Simplesmente Acontece, clássico q n cansa",
    ],
  },

  // ============== MADRUGADA ==============
  {
    id: "insonia",
    periods: ["n"],
    lines: [
      "alguém acordado a essa hora? 🌙",
      "eu, insônia bateu de novo",
      "mesma coisa aqui, n consigo dormir",
      "as melhores conversas acontecem de madrugada",
      "verdade, madrugada deixa tudo mais profundo",
      "vamo conversar então, tô precisando",
    ],
  },
  {
    id: "filosofica",
    periods: ["n"],
    lines: [
      "vcs acreditam em alma gêmea? 🌌",
      "acredito sim, mas n necessariamente uma só",
      "pra mim é mais sobre conexão q a gente cria",
      "fico pensando no sentido de tudo isso",
      "3am vibes batendo forte hj",
      "essa hora a cabeça viaja né",
    ],
  },
  {
    id: "confissao",
    periods: ["n"],
    lines: [
      "ngm vai ler msm né, vou desabafar kk",
      "tô aqui, manda",
      "ainda penso nele toda noite 🥺",
      "força aí, todo mundo já passou por isso",
      "passa, juro q passa",
      "obrigada gente, esse chat é meu refúgio ❤️",
    ],
  },

  // ============== FIM DE SEMANA ==============
  {
    id: "sabado_manha",
    periods: ["m"],
    days: [6],
    lines: [
      "sábado de manhã sem alarme = paraíso",
      "acordei naturalmente 9h, q luxo",
      "panqueca pro café, alguém? 🥞",
      "tô fazendo waffle aqui em casa",
      "que vontade, mando convite virtual?",
      "manda kkkk, café da manhã coletivo",
    ],
  },
  {
    id: "domingao",
    periods: ["a"],
    days: [0],
    lines: [
      "domingão de pijama o dia todo 🛌",
      "almoço de família domingo é tudo",
      "fiz feijoada hj, casa cheirosa",
      "feijoada no domingo é sagrado mds",
      "ansiedade de domingo à noite já chegando 😩",
      "para gente, deixa eu aproveitar o dia kkk",
    ],
  },
  {
    id: "domingo_noite",
    periods: ["e"],
    days: [0],
    lines: [
      "ansiedade de domingo à noite chegando 😩",
      "começou cedo aqui",
      "amanhã segunda... aff",
      "vamo dormir cedo então, vai ajudar",
      "tomara, hj quero levantar disposta",
      "boa sorte galera, amanhã a gente continua 💕",
    ],
  },

  // ============== ASSUNTOS DIVERSOS (qq período) ==============
  {
    id: "viagem",
    lines: [
      "queria viajar agora 😩",
      "indica um destino barato aí",
      "Chapada Diamantina, paraíso na terra",
      "Bonito MS é incrível, recomendo dms",
      "anotei os dois, obrigada gente",
      "praia do Rosa em SC tbm é mágica 🌊",
    ],
  },
  {
    id: "livros",
    lines: [
      "alguém aqui adora ler? indica um livro",
      "amo Clarice Lispector ❤️",
      "indico A Hipótese do Amor, viciei",
      "tô relendo Harry Potter pela 10ª vez kk",
      "HP é eterno né",
      "amei as dicas, vou comprar um esse fds",
    ],
  },
  {
    id: "pets",
    lines: [
      "alguém apaixonado por pet? 🐶",
      "tenho 3 gatos em casa kk",
      "cachorro pra mim sempre",
      "amo todo bicho, queria ter chácara só pra resgatar",
      "mesma vibe, tô doando pra ONG aqui da cidade",
      "isso é lindo demais, parabéns ❤️",
    ],
  },
  {
    id: "cidade",
    lines: [
      "alguém de SP aqui? 🙋",
      "Recife presente",
      "Curitiba na área 🙋‍♀️",
      "Salvador 🌞",
      "POA mandando bjs",
      "amo essa diversidade do chat 💕",
    ],
  },
  {
    id: "signo",
    lines: [
      "alguém de signo de leão? 🦁",
      "leoninaa aqui",
      "sou de peixes 🐟",
      "câncer, choro fácil kkk",
      "virginiano, exigente até com chat",
      "kkkkkk amo essa galera",
    ],
  },
  {
    id: "saudades",
    lines: [
      "saudade de quando a vida era simples",
      "esse chat me lembra os tempos do MSN kk",
      "mds eu tbm, era tão bom",
      "Orkut com depoimento longo nem se fala",
      "fui criança numa boa época",
      "verdade, hj td corrido demais",
    ],
  },
  {
    id: "mood_geral",
    lines: [
      "como vcs tão hj?",
      "tudo ótimo, e vc?",
      "to bem, cansada mas bem kk",
      "to numa vibe boa hj",
      "amo conversar com vcs ❤️",
      "esse chat virou minha terapia kk",
    ],
  },
  {
    id: "clima",
    lines: [
      "que calor hj 🥵",
      "aqui tá chovendo 🌧️",
      "frio gostoso aqui ❄️",
      "depende mt da região né",
      "amo dia de chuva, ar fica bom",
      "concordo, dorme melhor tbm",
    ],
  },

  // ============== FERIADOS ==============
  {
    id: "ano_novo",
    holidays: ["new_year", "new_year_eve"],
    lines: [
      "FELIZ ANO NOVO GENTE 🎆🎉",
      "feliz ano novooo ❤️",
      "q 2026 seja leve pra todos nós",
      "amém, merecemos um ano bom",
      "já fiz minhas metas, ano vai ser diferente",
      "vamooo, tmj sempre 🥂",
    ],
  },
  {
    id: "natal",
    holidays: ["christmas", "christmas_week"],
    lines: [
      "feliz Natal gente 🎄❤️",
      "feliz natal pra todoos",
      "ceia pronta aqui, casa cheirando a peru",
      "que delícia, aqui é tender",
      "amo o clima de natal",
      "também, é minha época favorita do ano 🎅",
    ],
  },
  {
    id: "junina",
    holidays: ["june_party"],
    lines: [
      "arraiá no fds, quem vai? 🤠🌽",
      "eu! já tô com o vestido pronto",
      "quentão e pamonha salvam o inverno 🔥",
      "canjica é melhor q tudo, brigando aqui kk",
      "kkkk cada um tem seu favorito",
      "junho é o melhor mês ❤️",
    ],
  },
  {
    id: "maes",
    holidays: ["mothers_day"],
    lines: [
      "feliz dia das mães pra todas as mães daqui ❤️",
      "feliz dia ❤️",
      "saudade da minha mãe hj",
      "abraço apertado pra vc 🫂",
      "obrigada gente, dia difícil",
      "passa, vai ficar tudo bem",
    ],
  },
  {
    id: "namorados",
    holidays: ["valentines_br"],
    lines: [
      "feliz dia dos namorados 💕",
      "solteira no dia dos namorados, mas tô bem kk",
      "tmj amiga, eu tbm",
      "amor próprio é o melhor de todos",
      "concordo demais, focada em mim",
      "essa é a vibe ❤️",
    ],
  },
];

function periodOf(d: Date): Period {
  const h = d.getHours();
  if (h >= 5 && h <= 11) return "m";
  if (h >= 12 && h <= 17) return "a";
  if (h >= 18 && h <= 22) return "e";
  return "n";
}

function holidaysOf(d: Date): string[] {
  const br = new Date(d.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const m = br.getMonth() + 1;
  const day = br.getDate();
  const out: string[] = [];
  if (m === 1 && day === 1) out.push("new_year", "new_year_day");
  if (m === 12 && day === 31) out.push("new_year_eve");
  if (m === 6 && day === 12) out.push("valentines_br");
  if (m === 5 && br.getDay() === 0 && day >= 8 && day <= 14) out.push("mothers_day");
  if (m === 8 && br.getDay() === 0 && day >= 8 && day <= 14) out.push("fathers_day");
  if (m === 6 && day >= 12 && day <= 29) out.push("june_party");
  if (m === 9 && day === 7) out.push("independence");
  if (m === 10 && day === 12) out.push("children_day");
  if (m === 12 && day === 25) out.push("christmas");
  if (m === 12 && day >= 20 && day <= 26) out.push("christmas_week");
  return out;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BLOCK_MS = 30 * 60 * 1000; // 30 min por tópico

function pickTopicForBlock(when: Date, rng: () => number): Topic {
  const period = periodOf(when);
  const dow = new Date(when.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })).getDay();
  const hols = holidaysOf(when);

  // Tópicos de feriado têm prioridade alta quando ativos
  const holidayTopics = TOPICS.filter(
    (t) => t.holidays && t.holidays.some((h) => hols.includes(h))
  );
  if (holidayTopics.length && rng() < 0.5) {
    return holidayTopics[Math.floor(rng() * holidayTopics.length)];
  }

  const cands = TOPICS.filter((t) => {
    if (t.holidays) return false; // já tratados acima
    if (t.periods && !t.periods.includes(period)) return false;
    if (t.days && !t.days.includes(dow)) return false;
    return true;
  });
  return cands[Math.floor(rng() * cands.length)] || TOPICS[0];
}

function makeBlockMessages(blockIdx: number): ChatMessage[] {
  const blockStart = blockIdx * BLOCK_MS;
  const when = new Date(blockStart);
  const rng = mulberry32(blockIdx * 2654435761);
  const topic = pickTopicForBlock(when, rng);

  // Pool de 5 participantes únicos para o bloco
  const pool: typeof users = [];
  let safety = 0;
  while (pool.length < 5 && safety++ < 200) {
    const u = users[Math.floor(rng() * users.length)];
    if (!pool.find((x) => x.id === u.id)) pool.push(u);
  }
  if (pool.length === 0) return [];

  const N = topic.lines.length;
  const stepMs = Math.floor(BLOCK_MS / (N + 1));
  const out: ChatMessage[] = [];
  let lastIdx = -1;
  for (let i = 0; i < N; i++) {
    let idx: number;
    if (i > 0 && rng() < 0.22) {
      idx = lastIdx; // mesmo participante repete (interação real)
    } else {
      do {
        idx = Math.floor(rng() * pool.length);
      } while (idx === lastIdx && pool.length > 1);
    }
    lastIdx = idx;
    const u = pool[idx];
    const jitter = Math.floor((rng() - 0.5) * 60000); // ±30s
    const ts = blockStart + stepMs * (i + 1) + jitter;
    out.push({
      id: `synthetic-${topic.id}-${blockIdx}-${i}`,
      user_id: u.id,
      room: "general",
      content: topic.lines[i],
      image_url: null,
      created_at: new Date(ts).toISOString(),
      sender_name: u.name,
      sender_avatar: u.avatar,
    });
  }
  return out.sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

// ---------- Resposta a mensagens do USUÁRIO REAL ----------
function pickUser() {
  return users[Math.floor(Math.random() * users.length)];
}

const REPLY_TO_REAL_USER: string[] = [
  "oi {nome}! td bem? 💕",
  "oiee {nome} 🤗",
  "{nome}, seja bem-vinda(o) ❤️",
  "olá {nome}, td bom?",
  "{nome} 👋 que bom te ver por aqui",
  "oi {nome}, de onde vc é?",
  "ei {nome}! 😊",
  "oi {nome}, primeira vez aqui?",
  "{nome} chegou! 🎉",
  "oie {nome}, como foi seu dia?",
  "salveee {nome}",
  "{nome}, conta novidades aí",
];

function firstName(full: string | null | undefined): string {
  if (!full) return "amiga";
  const n = full.trim().split(/\s+/)[0];
  return n || "amiga";
}

export function useGeneralRoomActivity(
  enabled: boolean,
  injectMessage: (msg: ChatMessage, opts?: { silent?: boolean }) => void,
  options?: {
    currentUserId?: string | null;
    currentUserName?: string | null;
    messages?: ChatMessage[];
  }
): { typingUsers: TypingUser[] } {
  const seededRef = useRef(false);
  const scheduledBlocksRef = useRef<Set<number>>(new Set());
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const replyTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const repliedToMsgIdsRef = useRef<Set<string>>(new Set());
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  const addTyping = useCallback((u: TypingUser) => {
    setTypingUsers((prev) => (prev.find((x) => x.id === u.id) ? prev : [...prev, u]));
  }, []);
  const removeTyping = useCallback((id: string) => {
    setTypingUsers((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const showTypingThen = useCallback(
    (userId: string, name: string, avatar: string, duration: number, commit: () => void) => {
      addTyping({ id: userId, name, avatar });
      const tm = setTimeout(() => {
        removeTyping(userId);
        commit();
      }, duration);
      timersRef.current.push(tm);
    },
    [addTyping, removeTyping]
  );

  const scheduleBlock = useCallback(
    (blockIdx: number) => {
      if (scheduledBlocksRef.current.has(blockIdx)) return;
      scheduledBlocksRef.current.add(blockIdx);
      const now = Date.now();
      const msgs = makeBlockMessages(blockIdx);
      msgs.forEach((msg) => {
        const t = new Date(msg.created_at).getTime();
        if (t <= now) {
          injectMessage(msg, { silent: true });
        } else {
          const typingMs = 2500;
          const delay = Math.max(0, t - now - typingMs);
          const tm = setTimeout(() => {
            showTypingThen(
              msg.user_id,
              msg.sender_name || "",
              msg.sender_avatar || "",
              typingMs,
              () => injectMessage(msg)
            );
          }, delay);
          timersRef.current.push(tm);
        }
      });
    },
    [injectMessage, showTypingThen]
  );

  // Seed + agendamento inicial e re-agendamento periódico
  useEffect(() => {
    if (!enabled) return;
    if (seededRef.current) return;
    seededRef.current = true;

    const populate = () => {
      const now = Date.now();
      const startBlock = Math.floor((now - 72 * 60 * 60 * 1000) / BLOCK_MS);
      const lookaheadBlock = Math.floor((now + 3 * 60 * 60 * 1000) / BLOCK_MS);
      for (let b = startBlock; b <= lookaheadBlock; b++) scheduleBlock(b);
    };
    populate();

    // A cada 30 min, garantir que blocos futuros adicionais sejam agendados
    const tick = () => {
      populate();
      refreshTimerRef.current = setTimeout(tick, BLOCK_MS);
    };
    refreshTimerRef.current = setTimeout(tick, BLOCK_MS);

    return () => {
      timersRef.current.forEach((tm) => clearTimeout(tm));
      timersRef.current = [];
      replyTimersRef.current.forEach((tm) => clearTimeout(tm));
      replyTimersRef.current = [];
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [enabled, scheduleBlock]);

  // Respostas a mensagens do usuário REAL (1–3 perfis citam o nome)
  useEffect(() => {
    if (!enabled) return;
    const { currentUserId, currentUserName, messages } = options || {};
    if (!currentUserId || !messages || messages.length === 0) return;

    const name = firstName(currentUserName);
    const cutoff = Date.now() - 60 * 1000;
    const fresh = messages.filter(
      (m) =>
        m.user_id === currentUserId &&
        new Date(m.created_at).getTime() >= cutoff &&
        !repliedToMsgIdsRef.current.has(m.id)
    );

    fresh.forEach((m) => {
      repliedToMsgIdsRef.current.add(m.id);
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const delay = 5000 + Math.random() * 25000 + i * (3000 + Math.random() * 5000);
        const tm = setTimeout(() => {
          const u = pickUser();
          const tpl = REPLY_TO_REAL_USER[Math.floor(Math.random() * REPLY_TO_REAL_USER.length)];
          const text = tpl.replace(/\{nome\}/g, name);
          const typingMs = 2000 + Math.random() * 3000;
          showTypingThen(u.id, u.name, u.avatar, typingMs, () => {
            const reply: ChatMessage = {
              id: `synthetic-reply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              user_id: u.id,
              room: "general",
              content: text,
              image_url: null,
              created_at: new Date().toISOString(),
              sender_name: u.name,
              sender_avatar: u.avatar,
            };
            injectMessage(reply);
          });
        }, delay);
        replyTimersRef.current.push(tm);
      }
    });
  }, [enabled, injectMessage, options, showTypingThen]);

  return { typingUsers };
}
