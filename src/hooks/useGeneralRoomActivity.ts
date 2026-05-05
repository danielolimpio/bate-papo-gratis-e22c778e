import { useEffect, useRef, useState, useCallback } from "react";
import { users } from "@/data/mockData";
import type { ChatMessage } from "./useMessages";

export interface TypingUser {
  id: string;
  name: string;
  avatar: string;
}

/**
 * Pools de mensagens organizadas por período do dia e contexto.
 * Cada mensagem possui tags para permitir respostas coerentes.
 */

type Tag =
  | "greet_morning"
  | "greet_afternoon"
  | "greet_evening"
  | "greet_night"
  | "greet_lateNight"
  | "greet_generic"
  | "reply_greet"
  | "question_city"
  | "answer_city"
  | "question_mood"
  | "answer_mood"
  | "question_food"
  | "answer_food"
  | "question_music"
  | "answer_music"
  | "question_movie"
  | "answer_movie"
  | "smalltalk"
  | "laugh"
  | "agree"
  | "compliment"
  | "goodbye_night"
  | "goodbye_generic"
  | "weather"
  | "work_morning"
  | "work_afternoon"
  | "lunch"
  | "dinner"
  | "coffee_morning"
  | "tired_night"
  | "weekend"
  | "feeling"
  | "afternoon_coffee"
  | "happy_hour"
  | "late_night_philo"
  | "late_night_confession"
  | "sunset"
  | "sunrise"
  | "saturday_morning"
  | "sunday_vibes"
  | "monday_blues"
  | "friday_hype"
  | "question_book"
  | "answer_book"
  | "question_travel"
  | "answer_travel"
  | "nostalgia";

interface Phrase {
  text: string;
  tags: Tag[];
  /** períodos válidos: m=manhã 5-11, a=tarde 12-17, e=noite 18-22, n=madrugada 23-4. Vazio = qualquer */
  periods?: Array<"m" | "a" | "e" | "n">;
  /** dias da semana válidos (0=dom..6=sáb). Vazio = qualquer */
  days?: number[];
  /** datas comemorativas válidas (chaves de HOLIDAYS). Se definido, SÓ aparece nessas datas. */
  holidays?: string[];
  /** tags que esta mensagem responde bem */
  repliesTo?: Tag[];
}

const PHRASES: Phrase[] = [
  // ===== SAUDAÇÕES POR PERÍODO =====
  { text: "bom dia galera ☀️", tags: ["greet_morning"], periods: ["m"] },
  { text: "bom diaaa ❤️", tags: ["greet_morning"], periods: ["m"] },
  { text: "bom dia, q dia lindo!", tags: ["greet_morning"], periods: ["m"] },
  { text: "bom dia amores ☕", tags: ["greet_morning"], periods: ["m"] },
  { text: "bom dia gente, acordando agora", tags: ["greet_morning"], periods: ["m"] },
  { text: "bom dia, q dia lindo pra recomeçar", tags: ["greet_morning"], periods: ["m"] },
  { text: "café da manhã e já no chat haha", tags: ["greet_morning", "coffee_morning"], periods: ["m"] },

  { text: "boa tarde 💙", tags: ["greet_afternoon"], periods: ["a"] },
  { text: "boa tarde galera 💛", tags: ["greet_afternoon"], periods: ["a"] },
  { text: "boa tarde pessoal", tags: ["greet_afternoon"], periods: ["a"] },
  { text: "tarde gente, td bem?", tags: ["greet_afternoon", "question_mood"], periods: ["a"] },

  { text: "boa noite gente ✨", tags: ["greet_evening"], periods: ["e"] },
  { text: "boa noite genteee", tags: ["greet_evening"], periods: ["e"] },
  { text: "boa noite ❤️", tags: ["greet_evening"], periods: ["e"] },
  { text: "noite pessoal, td bem por aí?", tags: ["greet_evening", "question_mood"], periods: ["e"] },
  { text: "cheguei do trampo, boa noite", tags: ["greet_evening"], periods: ["e"] },

  { text: "alguém acordado a essa hora? 🌙", tags: ["greet_lateNight"], periods: ["n"] },
  { text: "insônia bateu de novo", tags: ["greet_lateNight", "tired_night"], periods: ["n"] },
  { text: "madrugada e eu aqui kk", tags: ["greet_lateNight"], periods: ["n"] },
  { text: "ngm dorme nesse chat? 😅", tags: ["greet_lateNight"], periods: ["n"] },

  { text: "oi pessoal", tags: ["greet_generic"] },
  { text: "oiee", tags: ["greet_generic"] },
  { text: "cheguei agora, oi pra todos", tags: ["greet_generic"] },

  // ===== RESPOSTAS A SAUDAÇÕES =====
  { text: "bom dia 💕", tags: ["reply_greet"], periods: ["m"], repliesTo: ["greet_morning", "greet_generic"] },
  { text: "bom dia pra vc tbm ❤️", tags: ["reply_greet"], periods: ["m"], repliesTo: ["greet_morning"] },
  { text: "boa tarde 🌻", tags: ["reply_greet"], periods: ["a"], repliesTo: ["greet_afternoon", "greet_generic"] },
  { text: "boa tardee", tags: ["reply_greet"], periods: ["a"], repliesTo: ["greet_afternoon"] },
  { text: "boa noite ✨", tags: ["reply_greet"], periods: ["e", "n"], repliesTo: ["greet_evening", "greet_generic"] },
  { text: "noite linda", tags: ["reply_greet"], periods: ["e"], repliesTo: ["greet_evening"] },
  { text: "oii td bem?", tags: ["reply_greet", "question_mood"], repliesTo: ["greet_generic", "greet_morning", "greet_afternoon", "greet_evening"] },
  { text: "oi 🤗", tags: ["reply_greet"], repliesTo: ["greet_generic"] },
  { text: "tbm to acordada, vamo conversar", tags: ["reply_greet"], periods: ["n"], repliesTo: ["greet_lateNight"] },
  { text: "insônia aqui tbm", tags: ["reply_greet", "tired_night"], periods: ["n"], repliesTo: ["greet_lateNight"] },

  // ===== HUMOR / COMO VAI =====
  { text: "td bem por aí?", tags: ["question_mood"] },
  { text: "como vcs tão hj?", tags: ["question_mood"] },
  { text: "alguém pra um papo?", tags: ["question_mood", "smalltalk"] },
  { text: "tudo ótimo, e vc?", tags: ["answer_mood"], repliesTo: ["question_mood"] },
  { text: "to bem, cansada mas bem kk", tags: ["answer_mood"], repliesTo: ["question_mood"] },
  { text: "td certo por aqui ✨", tags: ["answer_mood"], repliesTo: ["question_mood"] },
  { text: "to numa vibe boa hj", tags: ["answer_mood", "feeling"], repliesTo: ["question_mood"] },

  // ===== CIDADE =====
  { text: "alguém de SP aqui?", tags: ["question_city"] },
  { text: "alguém de Minas?", tags: ["question_city"] },
  { text: "alguém de Recife?", tags: ["question_city"] },
  { text: "alguém do Sul aqui?", tags: ["question_city"] },
  { text: "Curitiba na área 🙋‍♀️", tags: ["answer_city"], repliesTo: ["question_city"] },
  { text: "Salvador presente 🌞", tags: ["answer_city"], repliesTo: ["question_city"] },
  { text: "Rio aqui ❤️", tags: ["answer_city"], repliesTo: ["question_city"] },
  { text: "POA mandando bjs", tags: ["answer_city"], repliesTo: ["question_city"] },
  { text: "Florianópolis 🏝️", tags: ["answer_city"], repliesTo: ["question_city"] },
  { text: "Belém na área", tags: ["answer_city"], repliesTo: ["question_city"] },
  { text: "SP aqui também", tags: ["answer_city"], repliesTo: ["question_city"] },

  // ===== COMIDA =====
  { text: "qual prato favorito de vcs?", tags: ["question_food"] },
  { text: "alguém cozinhando algo bom?", tags: ["question_food"] },
  { text: "almoço hj? indica aí", tags: ["question_food"], periods: ["m", "a"] },
  { text: "estrogonofe sempre 😋", tags: ["answer_food"], repliesTo: ["question_food"] },
  { text: "macarrão alho e óleo, simples e bom", tags: ["answer_food"], repliesTo: ["question_food"] },
  { text: "feijoada no domingo é sagrado", tags: ["answer_food"], days: [0], repliesTo: ["question_food"] },
  { text: "fiz lasanha hj, tá divina", tags: ["answer_food"], repliesTo: ["question_food"] },
  { text: "pizza sempre salva 🍕", tags: ["answer_food"], repliesTo: ["question_food"] },

  // ===== MÚSICA =====
  { text: "alguém ouvindo música? indica aí", tags: ["question_music"] },
  { text: "qual a trilha sonora de vcs hj?", tags: ["question_music"] },
  { text: "to ouvindo Marisa Monte 🎶", tags: ["answer_music"], repliesTo: ["question_music"] },
  { text: "Caetano sempre", tags: ["answer_music"], repliesTo: ["question_music"] },
  { text: "hj tô na vibe sertanejo", tags: ["answer_music"], repliesTo: ["question_music"] },
  { text: "Djavan no repeat", tags: ["answer_music"], repliesTo: ["question_music"] },

  // ===== FILME / SÉRIE =====
  { text: "alguém viu uma série boa recente?", tags: ["question_movie"] },
  { text: "indica um filme leve aí", tags: ["question_movie"] },
  { text: "to vendo um dorama, viciei", tags: ["answer_movie"], repliesTo: ["question_movie"] },
  { text: "indico Simplesmente Acontece, clássico", tags: ["answer_movie"], repliesTo: ["question_movie"] },
  { text: "tô maratonando Round 6 de novo kk", tags: ["answer_movie"], repliesTo: ["question_movie"] },
  { text: "comédia romântica sempre", tags: ["answer_movie"], repliesTo: ["question_movie"] },

  // ===== TRABALHO MANHÃ =====
  { text: "indo pro trampo, q preguiça", tags: ["work_morning"], periods: ["m"] },
  { text: "reunião 9h, socorro", tags: ["work_morning"], periods: ["m"] },
  { text: "café e bora encarar o dia", tags: ["work_morning", "coffee_morning"], periods: ["m"] },

  // ===== TRABALHO TARDE =====
  { text: "to no trabalho mas fingindo q n tô kk", tags: ["work_afternoon"], periods: ["a"] },
  { text: "que tarde longaaa", tags: ["work_afternoon"], periods: ["a"] },
  { text: "chefe passou agr, fingi q tava trabalhando", tags: ["work_afternoon"], periods: ["a"] },

  // ===== ALMOÇO / JANTA =====
  { text: "to no almoço, oi rapidão", tags: ["lunch", "greet_generic"], periods: ["a"] },
  { text: "horário do almoço, q delícia", tags: ["lunch"], periods: ["a"] },
  { text: "vou fazer janta, até mais tarde", tags: ["dinner", "goodbye_generic"], periods: ["e"] },
  { text: "janta saindo do forno 🍝", tags: ["dinner"], periods: ["e"] },

  // ===== NOITE / CANSAÇO =====
  { text: "que sono mds", tags: ["tired_night"], periods: ["e", "n"] },
  { text: "vou dormir, amanhã trabalho cedo", tags: ["tired_night", "goodbye_night"], periods: ["e", "n"] },
  { text: "exausta do dia, mas vim dar oi", tags: ["greet_evening", "tired_night"], periods: ["e"] },

  // ===== DESPEDIDAS =====
  { text: "boa noite, bons sonhos", tags: ["goodbye_night", "reply_greet"], periods: ["e", "n"], repliesTo: ["goodbye_night", "tired_night"] },
  { text: "durma bem 🌙", tags: ["goodbye_night", "reply_greet"], periods: ["e", "n"], repliesTo: ["goodbye_night", "tired_night"] },
  { text: "até amanhã gente", tags: ["goodbye_night"], periods: ["e", "n"] },
  { text: "bjs, até mais", tags: ["goodbye_generic"] },
  { text: "vou nessa, bom dia pra vcs", tags: ["goodbye_generic"], periods: ["m"] },
  { text: "tchau galera, boa tarde", tags: ["goodbye_generic"], periods: ["a"] },

  // ===== CLIMA =====
  { text: "que calor hj 🥵", tags: ["weather", "smalltalk"] },
  { text: "aqui tá chovendo 🌧️", tags: ["weather", "smalltalk"] },
  { text: "frio gostoso hj ❄️", tags: ["weather", "smalltalk"] },
  { text: "amo dia de chuva", tags: ["weather", "feeling"], repliesTo: ["weather"] },
  { text: "aqui tá um sol lindo ☀️", tags: ["weather"], periods: ["m", "a"] },

  // ===== FDS =====
  { text: "fim de semana chegando ❤️", tags: ["weekend"], days: [3, 4, 5] },
  { text: "ansiosa pelo fds 🙏", tags: ["weekend"], days: [3, 4, 5] },
  { text: "alguém com plano pro sábado?", tags: ["weekend", "smalltalk"], days: [4, 5] },
  { text: "domingão de descanso 🛋️", tags: ["weekend"], days: [0] },

  // ===== SMALLTALK / RISADAS / CONCORDÂNCIA =====
  { text: "kkkkkk", tags: ["laugh"], repliesTo: ["smalltalk", "work_afternoon", "feeling"] },
  { text: "hahahaha mds", tags: ["laugh"], repliesTo: ["smalltalk", "work_afternoon"] },
  { text: "kkkk relatable demais", tags: ["laugh"], repliesTo: ["work_afternoon", "tired_night"] },
  { text: "verdade", tags: ["agree"], repliesTo: ["feeling", "weekend", "weather", "smalltalk"] },
  { text: "concordo plenamente", tags: ["agree"], repliesTo: ["feeling", "weekend"] },
  { text: "tmj sempre", tags: ["agree", "compliment"] },
  { text: "vc é gente boa demais 💕", tags: ["compliment"], repliesTo: ["feeling", "answer_mood"] },
  { text: "amo essa galera daqui", tags: ["compliment", "feeling"] },

  // ===== FEELING / GERAL =====
  { text: "esse chat virou minha terapia kk", tags: ["feeling"] },
  { text: "tava precisando rir um pouco", tags: ["feeling"] },
  { text: "saudade de bate papo assim", tags: ["feeling"] },
  { text: "amo conversar com vcs", tags: ["feeling", "compliment"] },
  { text: "to numa fase boa, sentindo paz", tags: ["feeling"] },
  { text: "alguém precisando de carinho hj?", tags: ["feeling", "question_mood"] },
  { text: "vai ficar tudo bem 🤗", tags: ["compliment"], repliesTo: ["feeling"] },

  // ===== SMALLTALK GENÉRICO =====
  { text: "alguém de signo de leão? 🦁", tags: ["smalltalk"] },
  { text: "leoninaa aqui", tags: ["smalltalk"], repliesTo: ["smalltalk"] },
  { text: "sou de peixes 🐟", tags: ["smalltalk"], repliesTo: ["smalltalk"] },
  { text: "alguém apaixonado por gato? 🐱", tags: ["smalltalk"] },
  { text: "tenho 3 em casa kk", tags: ["smalltalk"], repliesTo: ["smalltalk"] },
  { text: "cachorro pra mim sempre 🐶", tags: ["smalltalk"], repliesTo: ["smalltalk"] },

  // ===== CAFÉ DA TARDE (15h-17h) =====
  { text: "hora do cafezinho da tarde ☕", tags: ["afternoon_coffee"], periods: ["a"] },
  { text: "café com bolo de fubá, alguém? 🍰", tags: ["afternoon_coffee", "question_food"], periods: ["a"] },
  { text: "16h, hora sagrada do café", tags: ["afternoon_coffee"], periods: ["a"] },
  { text: "tô precisando de um café URGENTE", tags: ["afternoon_coffee", "tired_night"], periods: ["a"] },
  { text: "cafézin pra aguentar até as 18h kk", tags: ["afternoon_coffee", "work_afternoon"], periods: ["a"] },
  { text: "biscoito com café é vida ❤️", tags: ["afternoon_coffee"], periods: ["a"], repliesTo: ["afternoon_coffee"] },
  { text: "to no café da tarde aqui no escritório", tags: ["afternoon_coffee", "work_afternoon"], periods: ["a"] },
  { text: "pão de queijo quentinho agora seria perfeito", tags: ["afternoon_coffee", "answer_food"], periods: ["a"], repliesTo: ["afternoon_coffee", "question_food"] },

  // ===== HAPPY HOUR (18h-21h) =====
  { text: "sextou! quem tá no happy hour? 🍻", tags: ["happy_hour", "friday_hype"], days: [5], periods: ["e"] },
  { text: "cervejinha gelada chamando", tags: ["happy_hour"], periods: ["e"] },
  { text: "alguém pra um chopp virtual? 🍺", tags: ["happy_hour"], periods: ["e"] },
  { text: "happy hour com a galera do trampo hj", tags: ["happy_hour"], days: [1, 2, 3, 4, 5], periods: ["e"] },
  { text: "to indo encontrar uns amigos no bar 🍷", tags: ["happy_hour"], periods: ["e"] },
  { text: "vinho e Netflix, meu happy hour kk", tags: ["happy_hour"], periods: ["e"], repliesTo: ["happy_hour"] },
  { text: "caipirinha aqui em casa, alguém quer? 🍋", tags: ["happy_hour"], periods: ["e"] },
  { text: "tô no boteco, mandando bjs pra vcs", tags: ["happy_hour", "greet_evening"], periods: ["e"] },
  { text: "porção de batata frita salvou o dia 🍟", tags: ["happy_hour", "answer_food"], periods: ["e"], repliesTo: ["happy_hour"] },

  // ===== MADRUGADA FILOSÓFICA =====
  { text: "será q a gente nasceu pra isso mesmo?", tags: ["late_night_philo"], periods: ["n"] },
  { text: "fico pensando no sentido de tudo isso 3am vibes", tags: ["late_night_philo"], periods: ["n"] },
  { text: "vcs acreditam em alma gêmea? 🌌", tags: ["late_night_philo", "question_mood"], periods: ["n"] },
  { text: "a vida passa rápido demais né", tags: ["late_night_philo", "feeling"], periods: ["n"] },
  { text: "tô pensando em tudo q deixei pra trás", tags: ["late_night_philo", "nostalgia"], periods: ["n"] },
  { text: "as melhores conversas acontecem de madrugada", tags: ["late_night_philo"], periods: ["n"], repliesTo: ["greet_lateNight", "late_night_philo"] },
  { text: "queria entender pq insisto nas mesmas pessoas", tags: ["late_night_philo", "late_night_confession"], periods: ["n"] },
  { text: "olho pro teto e fico só pensando 🌙", tags: ["late_night_philo"], periods: ["n"] },
  { text: "verdade, madrugada deixa tudo mais profundo", tags: ["late_night_philo", "agree"], periods: ["n"], repliesTo: ["late_night_philo"] },

  // ===== CONFISSÃO DE MADRUGADA =====
  { text: "ngm vai ler msm né, vou desabafar kk", tags: ["late_night_confession"], periods: ["n"] },
  { text: "ainda penso nele toda noite 🥺", tags: ["late_night_confession"], periods: ["n"] },
  { text: "to com saudade de quem nem merece", tags: ["late_night_confession"], periods: ["n"] },
  { text: "passa, juro q passa", tags: ["compliment"], repliesTo: ["late_night_confession"] },
  { text: "força aí, todo mundo já passou por isso", tags: ["compliment", "agree"], repliesTo: ["late_night_confession"] },
  { text: "te entendo demais 🫂", tags: ["compliment"], repliesTo: ["late_night_confession"] },

  // ===== POR DO SOL / FIM DE TARDE =====
  { text: "que pôr do sol lindo hj 🌅", tags: ["sunset"], periods: ["a", "e"] },
  { text: "céu rosa hj, tô apaixonada", tags: ["sunset"], periods: ["e"] },
  { text: "fui na janela ver o sol se pôr ❤️", tags: ["sunset", "feeling"], periods: ["e"] },
  { text: "esse fim de tarde tá uma poesia", tags: ["sunset"], periods: ["e"], repliesTo: ["sunset"] },

  // ===== AMANHECER =====
  { text: "acordei antes do despertador, q raiva kk", tags: ["sunrise"], periods: ["m"] },
  { text: "vi o sol nascer hj, raro 🌄", tags: ["sunrise"], periods: ["m"] },
  { text: "manhã fresquinha, q delícia", tags: ["sunrise", "weather"], periods: ["m"] },

  // ===== SÁBADO DE MANHÃ =====
  { text: "sábado de manhã sem alarme = paraíso", tags: ["saturday_morning", "weekend"], days: [6], periods: ["m"] },
  { text: "feirinha de sábado hj 🥬", tags: ["saturday_morning"], days: [6], periods: ["m"] },
  { text: "panqueca pro café, alguém? 🥞", tags: ["saturday_morning", "question_food"], days: [6], periods: ["m"] },

  // ===== DOMINGO VIBES =====
  { text: "domingão de pijama o dia todo 🛌", tags: ["sunday_vibes", "weekend"], days: [0] },
  { text: "almoço de família domingo é tudo", tags: ["sunday_vibes"], days: [0], periods: ["a"] },
  { text: "ansiedade de domingo à noite chegando 😩", tags: ["sunday_vibes", "monday_blues"], days: [0], periods: ["e"] },
  { text: "domingo passa voando né", tags: ["sunday_vibes"], days: [0], repliesTo: ["sunday_vibes"] },

  // ===== SEGUNDA / MONDAY BLUES =====
  { text: "segunda já chegando, socorro", tags: ["monday_blues"], days: [0], periods: ["e"] },
  { text: "odeio acordar segunda 😭", tags: ["monday_blues"], days: [1], periods: ["m"] },
  { text: "segunda nem é tão ruim assim né? .... é sim", tags: ["monday_blues"], days: [1], periods: ["m"], repliesTo: ["monday_blues"] },

  // ===== SEXTA HYPE =====
  { text: "SEXTOOOOU 🎉", tags: ["friday_hype"], days: [5] },
  { text: "sexta-feira, melhor dia da semana", tags: ["friday_hype"], days: [5] },
  { text: "finalmente sexta, q semanaaa", tags: ["friday_hype", "feeling"], days: [5] },

  // ===== LIVROS =====
  { text: "alguém aqui adora ler? indica um livro", tags: ["question_book"] },
  { text: "to lendo um romance bom dms", tags: ["answer_book"], repliesTo: ["question_book"] },
  { text: "amo Clarice Lispector ❤️", tags: ["answer_book"], repliesTo: ["question_book"] },
  { text: "indico A Hipótese do Amor, viciei", tags: ["answer_book"], repliesTo: ["question_book"] },
  { text: "tô relendo Harry Potter pela 10ª vez kk", tags: ["answer_book"], repliesTo: ["question_book"] },

  // ===== VIAGEM =====
  { text: "queria viajar agora 😩", tags: ["question_travel", "feeling"] },
  { text: "indica um destino barato aí", tags: ["question_travel"] },
  { text: "Chapada Diamantina, paraíso na terra", tags: ["answer_travel"], repliesTo: ["question_travel"] },
  { text: "Bonito MS é incrível, recomendo", tags: ["answer_travel"], repliesTo: ["question_travel"] },
  { text: "praia do Rosa em SC, magia pura 🌊", tags: ["answer_travel"], repliesTo: ["question_travel"] },
  { text: "Jericoacoara, sem palavras", tags: ["answer_travel"], repliesTo: ["question_travel"] },

  // ===== NOSTALGIA =====
  { text: "saudade de quando a vida era simples", tags: ["nostalgia", "feeling"] },
  { text: "lembrei da minha infância agora 🥺", tags: ["nostalgia"] },
  { text: "esse chat me lembra os tempos do MSN kk", tags: ["nostalgia", "feeling"] },
  { text: "mds eu tbm, era tão bom", tags: ["nostalgia", "agree"], repliesTo: ["nostalgia"] },

  // ===== DATAS COMEMORATIVAS =====
  // Ano Novo
  { text: "FELIZ ANO NOVO GENTE 🎆🎉", tags: ["smalltalk", "feeling"], holidays: ["new_year"] },
  { text: "q 2026 seja leve pra todos nós ❤️", tags: ["feeling"], holidays: ["new_year"] },
  { text: "ressaca de ano novo bateu forte kk", tags: ["feeling"], holidays: ["new_year_day"] },
  // Carnaval
  { text: "carnaval chegando, alguém vai pular?", tags: ["smalltalk"], holidays: ["carnival_week"] },
  { text: "bloquinho hj, glitter no rosto e vamo 🎭", tags: ["feeling"], holidays: ["carnival"] },
  // Páscoa
  { text: "feliz Páscoa gente 🐰🍫", tags: ["smalltalk", "feeling"], holidays: ["easter"] },
  { text: "ovo de chocolate é vida ❤️", tags: ["answer_food"], holidays: ["easter"] },
  // Dia das Mães
  { text: "feliz dia das mães pra todas as mães daqui ❤️", tags: ["feeling", "compliment"], holidays: ["mothers_day"] },
  // Dia dos Namorados
  { text: "feliz dia dos namorados 💕", tags: ["feeling"], holidays: ["valentines_br"] },
  { text: "solteira no dia dos namorados, mas tô bem kk", tags: ["feeling"], holidays: ["valentines_br"] },
  // Festa Junina
  { text: "arraiá no fds, quem vai? 🤠🌽", tags: ["smalltalk"], holidays: ["june_party"] },
  { text: "quentão e pamonha salvam o inverno 🔥", tags: ["answer_food"], holidays: ["june_party"] },
  // Dia dos Pais
  { text: "feliz dia dos pais pra todos os pais 👨‍👧", tags: ["feeling", "compliment"], holidays: ["fathers_day"] },
  // Independência
  { text: "feriado de 7 de setembro, descansando 🇧🇷", tags: ["feeling"], holidays: ["independence"] },
  // Dia das Crianças
  { text: "feliz dia das crianças pra criança q mora em nós 🧸", tags: ["feeling"], holidays: ["children_day"] },
  // Finados
  { text: "feriado de finados, dia de lembrar quem se foi 🕯️", tags: ["feeling", "nostalgia"], holidays: ["finados"] },
  // Black Friday
  { text: "black friday hj, alguém comprando algo? 🛍️", tags: ["smalltalk"], holidays: ["black_friday"] },
  // Natal
  { text: "feliz Natal gente 🎄❤️", tags: ["feeling"], holidays: ["christmas"] },
  { text: "ceia de natal é tudo de bom 🍷", tags: ["answer_food"], holidays: ["christmas"] },
  { text: "clima de natal já tomou conta da casa 🎅", tags: ["feeling"], holidays: ["christmas_week"] },
  // Réveillon
  { text: "ano vai virar, q emoção 🥂", tags: ["feeling"], holidays: ["new_year_eve"] },
];

function periodOf(d: Date): "m" | "a" | "e" | "n" {
  const h = d.getHours();
  if (h >= 5 && h <= 11) return "m";
  if (h >= 12 && h <= 17) return "a";
  if (h >= 18 && h <= 22) return "e";
  return "n";
}

/** Retorna chaves de feriados/datas comemorativas ativas para a data fornecida (fuso BR). */
function holidaysOf(d: Date): string[] {
  // Garantimos data em fuso BR (America/Sao_Paulo) usando offset
  const br = new Date(d.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const m = br.getMonth() + 1; // 1-12
  const day = br.getDate();
  const out: string[] = [];

  if (m === 1 && day === 1) out.push("new_year", "new_year_day");
  if (m === 12 && day === 31) out.push("new_year_eve");
  if (m === 2 && day === 14) out.push("valentines_intl");
  if (m === 6 && day === 12) out.push("valentines_br");
  if (m === 4 && day >= 21 && day <= 22) out.push("tiradentes");
  if (m === 5 && day === 1) out.push("labor_day");
  // Dia das Mães: 2º domingo de maio
  if (m === 5 && br.getDay() === 0 && day >= 8 && day <= 14) out.push("mothers_day");
  // Dia dos Pais: 2º domingo de agosto
  if (m === 8 && br.getDay() === 0 && day >= 8 && day <= 14) out.push("fathers_day");
  if (m === 6 && day >= 12 && day <= 29) out.push("june_party");
  if (m === 9 && day === 7) out.push("independence");
  if (m === 10 && day === 12) out.push("children_day");
  if (m === 11 && day === 2) out.push("finados");
  if (m === 11 && day === 15) out.push("republic");
  // Black Friday: última sexta de novembro
  if (m === 11 && br.getDay() === 5 && day >= 23 && day <= 29) out.push("black_friday");
  if (m === 12 && day === 25) out.push("christmas");
  if (m === 12 && day >= 20 && day <= 26) out.push("christmas_week");
  // Páscoa e carnaval são móveis — usamos aproximação por mês
  if (m === 3 || m === 4) {
    // Páscoa quase sempre cai entre 22/3 e 25/4 — não calculamos exatamente,
    // mas marcamos um intervalo amplo apenas para "easter_season" não obrigatório.
  }
  return out;
}

// ---------- Deterministic RNG (so all devices see the same Sala Geral) ----------
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SLOT_MS = 7 * 60 * 1000; // 1 mensagem sintética a cada 7 min (alinhada globalmente)

function slotIndex(when: Date): number {
  return Math.floor(when.getTime() / SLOT_MS);
}

function slotRng(slot: number) {
  return mulberry32(slot * 2654435761);
}

function pickPhraseDet(when: Date, lastTags: Tag[] | null, rng: () => number): Phrase {
  const period = periodOf(when);
  const day = new Date(when.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })).getDay();
  const activeHolidays = holidaysOf(when);

  let candidates = PHRASES.filter((p) => {
    if (p.periods && !p.periods.includes(period)) return false;
    if (p.days && !p.days.includes(day)) return false;
    if (p.holidays && !p.holidays.some((h) => activeHolidays.includes(h))) return false;
    return true;
  });

  if (lastTags && lastTags.length && rng() < 0.6) {
    const replies = candidates.filter(
      (p) => p.repliesTo && p.repliesTo.some((t) => lastTags.includes(t))
    );
    if (replies.length) candidates = replies;
  }
  return candidates[Math.floor(rng() * candidates.length)] || PHRASES[0];
}

function pickUserDet(rng: () => number) {
  return users[Math.floor(rng() * users.length)];
}

function makeSlotMsg(slot: number, lastTags: Tag[] | null): { msg: ChatMessage; tags: Tag[] } {
  const when = new Date(slot * SLOT_MS);
  const rng = slotRng(slot);
  const u = pickUserDet(rng);
  const phrase = pickPhraseDet(when, lastTags, rng);
  return {
    msg: {
      id: `synthetic-general-${slot}`,
      user_id: u.id,
      room: "general",
      content: phrase.text,
      image_url: null,
      created_at: when.toISOString(),
      sender_name: u.name,
      sender_avatar: u.avatar,
    },
    tags: phrase.tags,
  };
}

// Legacy (ainda usado para respostas a usuário real — random local é OK aqui)
function pickUser() {
  return users[Math.floor(Math.random() * users.length)];
}

/**
 * Templates de resposta para quando o usuário REAL envia mensagem.
 * {nome} é substituído pelo primeiro nome do usuário.
 */
const REPLY_TO_REAL_USER: string[] = [
  "oi {nome}! td bem? 💕",
  "oiee {nome} 🤗",
  "{nome}, seja bem-vinda(o) ❤️",
  "olá {nome}, td bom?",
  "{nome} 👋 que bom te ver por aqui",
  "oi {nome}, de onde vc é?",
  "{nome}, td bem contigo?",
  "ei {nome}! 😊",
  "oi {nome}, primeira vez aqui?",
  "{nome} chegou! 🎉",
  "oie {nome}, como foi seu dia?",
  "opa {nome}, blz?",
  "{nome} ❤️ tmj",
  "oi {nome}, conta novidades aí",
  "{nome} 🌹 td certo?",
  "olá {nome}, prazer!",
  "{nome}, vc é nova(o) por aqui né?",
  "salveee {nome}",
  "oi {nome}, q nome lindo 💫",
  "{nome}, bem vinda(o) ao chat 🤗",
];

function firstName(full: string | null | undefined): string {
  if (!full) return "amiga";
  const n = full.trim().split(/\s+/)[0];
  return n || "amiga";
}

function makeReplyToUser(name: string, when: Date): ChatMessage {
  const u = pickUser();
  const tpl = REPLY_TO_REAL_USER[Math.floor(Math.random() * REPLY_TO_REAL_USER.length)];
  const text = tpl.replace(/\{nome\}/g, name);
  return {
    id: `synthetic-reply-${when.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    user_id: u.id,
    room: "general",
    content: text,
    image_url: null,
    created_at: when.toISOString(),
    sender_name: u.name,
    sender_avatar: u.avatar,
  };
}

/**
 * Popula a Sala Geral com atividade sintética coerente:
 * - Mensagens respeitam o horário do dia.
 * - 60% de chance de responder em contexto à mensagem anterior.
 * - Quando o usuário REAL envia, 1–3 perfis fictícios respondem citando o nome.
 * - Seed das últimas 72h + injeção a cada 5–10 min.
 */
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTagsRef = useRef<Tag[] | null>(null);
  const repliedToMsgIdsRef = useRef<Set<string>>(new Set());
  const replyTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const typingTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  const addTyping = useCallback((u: TypingUser) => {
    setTypingUsers((prev) => (prev.find((x) => x.id === u.id) ? prev : [...prev, u]));
  }, []);
  const removeTyping = useCallback((id: string) => {
    setTypingUsers((prev) => prev.filter((x) => x.id !== id));
  }, []);

  /** Mostra "digitando..." por `duration`ms e então executa `commit`. */
  const showTypingThen = useCallback(
    (userId: string, name: string, avatar: string, duration: number, commit: () => void) => {
      addTyping({ id: userId, name, avatar });
      const tm = setTimeout(() => {
        removeTyping(userId);
        commit();
      }, duration);
      typingTimersRef.current.push(tm);
    },
    [addTyping, removeTyping]
  );

  // ---- Seed + agendamento contínuo ----
  useEffect(() => {
    if (!enabled) return;
    if (seededRef.current) return;
    seededRef.current = true;

    const now = Date.now();
    let t = now - 72 * 60 * 60 * 1000;
    let lastTags: Tag[] | null = null;
    while (t < now - 30 * 1000) {
      const gap = (5 + Math.random() * 5) * 60 * 1000;
      t += gap;
      if (t >= now) break;
      const { msg, tags } = makeMsg(new Date(t), lastTags);
      injectMessage(msg, { silent: true });
      lastTags = tags;
    }
    lastTagsRef.current = lastTags;

    const scheduleNext = () => {
      const delay = (5 + Math.random() * 5) * 60 * 1000;
      timerRef.current = setTimeout(() => {
        // Pré-monta a mensagem para sabermos quem está "digitando"
        const u = pickUser();
        const phrase = pickPhrase(new Date(), lastTagsRef.current);
        const typingMs = 2000 + Math.random() * 4000; // 2–6s
        showTypingThen(u.id, u.name, u.avatar, typingMs, () => {
          const msg: ChatMessage = {
            id: `synthetic-general-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            user_id: u.id,
            room: "general",
            content: phrase.text,
            image_url: null,
            created_at: new Date().toISOString(),
            sender_name: u.name,
            sender_avatar: u.avatar,
          };
          injectMessage(msg);
          lastTagsRef.current = phrase.tags;
        });
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      replyTimersRef.current.forEach((tm) => clearTimeout(tm));
      replyTimersRef.current = [];
      typingTimersRef.current.forEach((tm) => clearTimeout(tm));
      typingTimersRef.current = [];
    };
  }, [enabled, injectMessage, showTypingThen]);

  // ---- Detecta mensagens do USUÁRIO REAL e agenda respostas nominativas ----
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
          const typingMs = 2000 + Math.random() * 3000; // 2–5s
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
            lastTagsRef.current = ["greet_generic", "reply_greet"];
          });
        }, delay);
        replyTimersRef.current.push(tm);
      }
    });
  }, [enabled, injectMessage, options, showTypingThen]);

  return { typingUsers };
}

