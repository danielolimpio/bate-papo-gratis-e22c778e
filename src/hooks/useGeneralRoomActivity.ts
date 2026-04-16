import { useEffect, useRef } from "react";
import { users } from "@/data/mockData";
import type { ChatMessage } from "./useMessages";

/**
 * Pool of varied, natural Brazilian Portuguese chat messages.
 * Used to populate the General Room with synthetic activity.
 */
const MESSAGE_POOL = [
  "oi pessoal, td bem por aí?",
  "boa noite gente ✨",
  "alguém de SP aqui?",
  "que dia corrido hj 😅",
  "acabei de chegar do trabalho, exausta",
  "alguém pra um papo?",
  "to amando esse chat, parece q voltei pra 2010 kkk",
  "saudade de bate papo assim",
  "bom dia galera ☀️",
  "café da manhã e já no chat haha",
  "alguém de Minas?",
  "Curitiba na área 🙋‍♀️",
  "to chegando agora, oi pra todos",
  "que sono hj meu deus",
  "alguém viu o jogo ontem?",
  "tava precisando rir um pouco",
  "boa tarde 💙",
  "to no almoço, oi rapidão",
  "vcs trabalham com o quê?",
  "to de folga hj, q delícia",
  "fim de semana chegando ❤️",
  "alguém cozinhando algo bom?",
  "fiz lasanha hj, tá divina",
  "queria viajar agora",
  "praia ou montanha?",
  "praia sempre 🌊",
  "montanha pra mim, friozinho ❄️",
  "alguém solteiro por aqui?",
  "to solteira faz tempo já rs",
  "complicado conhecer gente nova",
  "esse chat ajuda né",
  "to gostando daqui",
  "primeira vez que entro",
  "bem vindo então 😊",
  "obrigada gente",
  "alguém ouvindo música? indica aí",
  "to ouvindo Marisa Monte",
  "amo demais",
  "Caetano sempre",
  "hj tô na vibe sertanejo",
  "kkk cada um",
  "vou fazer um chá, jaja volto",
  "boa, traz pra mim tbm",
  "kkkkk",
  "alguém aqui adora ler?",
  "tô lendo um romance bom",
  "indica aí",
  "depois te mando no privado",
  "combinado",
  "bom dia, q dia lindo!",
  "aqui tá chovendo 🌧️",
  "amo dia de chuva",
  "eu não, me dá preguiça kkk",
  "to com fome de novo",
  "pizza no fds 🍕",
  "to dentro",
  "marca aí então",
  "alguém de Recife?",
  "Salvador presente 🌞",
  "Rio aqui ❤️",
  "Belém na área",
  "POA mandando bjs",
  "alguém viu uma série boa recente?",
  "to vendo um dorama, viciei",
  "qual?",
  "te conto no privado kk",
  "filme bom hj?",
  "queria assistir algo leve",
  "comédia romântica sempre",
  "indico Simplesmente Acontece, clássico",
  "amo esse 😍",
  "boa noite genteee",
  "vou dormir, amanhã trabalho cedo",
  "boa noite, bons sonhos",
  "durma bem 🌙",
  "alguém acordado?",
  "insônia aqui tbm",
  "bora conversar então",
  "bora",
  "que calor hj 🥵",
  "aqui tá frio, troca?",
  "kkkkkk Brasil né",
  "alguém apaixonado?",
  "complicado responder isso kkk",
  "to tentando esquecer alguém ngl",
  "dor de cotovelo é foda",
  "passa, juro",
  "obrigada 🥺",
  "força aí",
  "valeu galera, vcs são gente boa",
  "esse chat virou minha terapia kk",
  "mds eu tbm",
  "voltei",
  "demorou hein",
  "to no ônibus indo pra casa",
  "boa viagem",
  "alguém de bike igual eu?",
  "amo pedalar",
  "tô tentando começar a correr",
  "boa, faz bem demais",
  "academia hj? ninguém? só eu? kk",
  "fui ontem, hj descanso",
  "bom dia amores ☕",
  "café e chat, combinação perfeita",
  "alguém do Sul aqui?",
  "Florianópolis 🏝️",
  "que inveja",
  "tô em casa fazendo nada kkk",
  "melhor coisa",
  "domingo é pra isso mesmo",
  "alguém me indica um lugar bom pra viajar barato?",
  "Chapada Diamantina, paraíso",
  "anotado",
  "Bonito MS tbm é incrível",
  "quero conhecer 😍",
  "tô aprendendo inglês, alguém ajuda?",
  "posso treinar contigo",
  "manda no pv",
  "que legal a galera daqui",
  "bem acolhedor né",
  "verdade",
  "vou fazer janta, ate mais tarde",
  "tchau, bom apetite",
  "obg ❤️",
  "alguém viu o pôr do sol hj?",
  "lindo dms",
  "tirei foto, depois posto",
  "bora marcar um encontro virtual?",
  "kkk como assim",
  "tipo todo mundo entrar no mesmo horário",
  "boa ideia",
  "amanhã 21h?",
  "tô dentro",
  "eu tbm",
  "fechou então",
  "alguém de signo de leão? 🦁",
  "leoninaa aqui",
  "kkk amei",
  "sou de peixes",
  "câncer presente",
  "virginiana sumida kk",
  "alguém aqui gosta de cozinhar?",
  "amo demais",
  "qual prato favorito?",
  "estrogonofe sempre",
  "macarrão alho e óleo, simples e bom",
  "feijoada no domingo é sagrado",
  "aff to com fome agora",
  "kkkkk culpa nossa",
  "to no trabalho mas fingindo q n tô",
  "kkkkkkk relatable",
  "chefe passou agr, fingi q tava trabalhando",
  "kkkkk clássico",
  "boa tarde galera 💛",
  "alguém ansioso pelo fds?",
  "demais",
  "sexta chega logo",
  "ainda é terça 😭",
  "naoooo",
  "essa semana tá longa",
  "aguenta firme",
  "vamos juntos",
  "✨",
  "alguém apaixonado por gato? 🐱",
  "tenho 3 em casa kk",
  "amo gato",
  "cachorro pra mim sempre",
  "tenho os dois e amo",
  "melhor escolha",
  "bom dia, q dia lindo pra recomeçar",
  "verdade, motivacional ❤️",
  "alguém precisando de carinho hj?",
  "eu eu eu",
  "vai ficar tudo bem 🤗",
  "obrigada gente, choro",
  "tmj sempre",
  "essa galera é especial",
  "concordo",
  "to começando faculdade ano q vem",
  "que legal, vai estudar o quê?",
  "psicologia",
  "amei a área",
  "boa sorte",
  "obrigada 💕",
  "alguém aqui é freelancer?",
  "sim, designer",
  "trabalho remoto é tudo",
  "concordo",
  "queria conseguir um trampo remoto",
  "vai conseguir, fé",
  "obrigada moça",
  "boa noite gente, vou desligar",
  "boa noite ❤️",
  "até amanhã",
  "amanhã tem mais",
  "bjs galera",
  "tchauu",
];

const usedRecent: string[] = []; // last 30 to avoid repeats

function pickMessage(): string {
  let attempts = 0;
  while (attempts < 20) {
    const m = MESSAGE_POOL[Math.floor(Math.random() * MESSAGE_POOL.length)];
    if (!usedRecent.includes(m)) {
      usedRecent.push(m);
      if (usedRecent.length > 30) usedRecent.shift();
      return m;
    }
    attempts++;
  }
  return MESSAGE_POOL[Math.floor(Math.random() * MESSAGE_POOL.length)];
}

function pickUser() {
  return users[Math.floor(Math.random() * users.length)];
}

function makeMsg(createdAt: Date): ChatMessage {
  const u = pickUser();
  return {
    id: `synthetic-general-${createdAt.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    user_id: u.id,
    room: "general",
    content: pickMessage(),
    image_url: null,
    created_at: createdAt.toISOString(),
    sender_name: u.name,
    sender_avatar: u.avatar,
  };
}

/**
 * Populates the General Room with synthetic chat activity.
 * - Seeds the last ~72h of history on mount (visual only, not persisted).
 * - Continuously injects new messages every 5–10 minutes.
 * - Messages older than 72h are not shown (the seed already respects that window).
 *
 * NOTE: Messages are local-only (injected via injectLocalMessage); they are NOT saved to DB.
 */
export function useGeneralRoomActivity(
  enabled: boolean,
  injectMessage: (msg: ChatMessage, opts?: { silent?: boolean }) => void
) {
  const seededRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (seededRef.current) return;
    seededRef.current = true;

    // ---- SEED last 72h of history ----
    const now = Date.now();
    const seedMessages: ChatMessage[] = [];
    // ~6–12 messages per hour over ~72h => spread evenly with jitter.
    let t = now - 72 * 60 * 60 * 1000;
    while (t < now - 30 * 1000) {
      // gap 5–10 min
      const gap = (5 + Math.random() * 5) * 60 * 1000;
      t += gap;
      if (t >= now) break;
      seedMessages.push(makeMsg(new Date(t)));
    }
    // Inject in chronological order silently
    seedMessages.forEach((m) => injectMessage(m, { silent: true }));

    // ---- Schedule live messages every 5–10 min ----
    const scheduleNext = () => {
      const delay = (5 + Math.random() * 5) * 60 * 1000;
      timerRef.current = setTimeout(() => {
        injectMessage(makeMsg(new Date()));
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, injectMessage]);
}
