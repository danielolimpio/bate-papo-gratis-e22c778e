import avatar1 from "@/assets/avatars/avatar1.jpg";
import avatar2 from "@/assets/avatars/avatar2.jpg";
import avatar3 from "@/assets/avatars/avatar3.jpg";
import avatar4 from "@/assets/avatars/avatar4.jpg";
import avatar5 from "@/assets/avatars/avatar5.jpg";
import avatar6 from "@/assets/avatars/avatar6.jpg";
import avatar7 from "@/assets/avatars/avatar7.jpg";
import avatar8 from "@/assets/avatars/avatar8.jpg";
import profileM1 from "@/assets/profiles/profile-m1.jpg";
import profileF1 from "@/assets/profiles/profile-f1.jpg";
import profileF2 from "@/assets/profiles/profile-f2.jpg";
import profileM2 from "@/assets/profiles/profile-m2.jpg";
import profileF3 from "@/assets/profiles/profile-f3.jpg";
import profileM3 from "@/assets/profiles/profile-m3.jpg";
import profileF4 from "@/assets/profiles/profile-f4.jpg";
import profileM4 from "@/assets/profiles/profile-m4.jpg";
import profileM5 from "@/assets/profiles/profile-m5.jpg";
import profileF5 from "@/assets/profiles/profile-f5.jpg";
import profileM6 from "@/assets/profiles/profile-m6.jpg";
import profileM7 from "@/assets/profiles/profile-m7.jpg";
import profileM8 from "@/assets/profiles/profile-m8.jpg";
import profileF6 from "@/assets/profiles/profile-f6.jpg";
import profileM9 from "@/assets/profiles/profile-m9.jpg";
import profileF7 from "@/assets/profiles/profile-f7.jpg";
import profileM10 from "@/assets/profiles/profile-m10.jpg";
import profileM11 from "@/assets/profiles/profile-m11.jpg";
import profileF8 from "@/assets/profiles/profile-f8.jpg";
import profileF9 from "@/assets/profiles/profile-f9.jpg";
import profileF10 from "@/assets/profiles/profile-f10.jpg";
import profileF11 from "@/assets/profiles/profile-f11.jpg";
import profileF12 from "@/assets/profiles/profile-f12.jpg";
import profileF13 from "@/assets/profiles/profile-f13.jpg";
import profileF14 from "@/assets/profiles/profile-f14.jpg";
import profileF15 from "@/assets/profiles/profile-f15.jpg";
import profileF16 from "@/assets/profiles/profile-f16.jpg";
import profileF17 from "@/assets/profiles/profile-f17.jpg";
import profileF18 from "@/assets/profiles/profile-f18.jpg";
import profileF19 from "@/assets/profiles/profile-f19.jpg";

export type Gender = "Masculino" | "Feminino" | "Outro";
export type Interest = "Homens" | "Mulheres" | "Ambos";
export type RelationshipStatus = "Solteiro(a)" | "Casado(a)" | "Viúvo(a)" | "Separado(a)" | "Enrolado(a)" | "Namorando";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  interest: Interest;
  city: string;
  relationshipStatus: RelationshipStatus;
  showRelationshipStatus: boolean;
  avatar: string;
  photos: string[];
  isOnline: boolean;
  lastSeen?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8];

export const currentUser: UserProfile = {
  id: "me",
  name: "Você",
  age: 26,
  gender: "Masculino",
  interest: "Mulheres",
  city: "São Paulo",
  relationshipStatus: "Solteiro(a)",
  showRelationshipStatus: true,
  avatar: avatar2,
  photos: [avatar2],
  isOnline: true,
};

export const users: UserProfile[] = [
  { id: "1", name: "Camila Santos", age: 25, gender: "Feminino", interest: "Homens", city: "Rio de Janeiro", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: avatar1, photos: [avatar1, avatar5, avatar7], isOnline: true },
  { id: "2", name: "Rafael Oliveira", age: 30, gender: "Masculino", interest: "Mulheres", city: "São Paulo", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: avatar2, photos: [avatar2, avatar4], isOnline: true },
  { id: "3", name: "Aline Ferreira", age: 22, gender: "Feminino", interest: "Ambos", city: "Belo Horizonte", relationshipStatus: "Namorando", showRelationshipStatus: false, avatar: avatar3, photos: [avatar3, avatar1], isOnline: true },
  { id: "4", name: "Lucas Mendes", age: 28, gender: "Masculino", interest: "Mulheres", city: "Curitiba", relationshipStatus: "Separado(a)", showRelationshipStatus: true, avatar: avatar4, photos: [avatar4, avatar6, avatar8], isOnline: false, lastSeen: "há 2h" },
  { id: "5", name: "Fernanda Lima", age: 35, gender: "Feminino", interest: "Homens", city: "Salvador", relationshipStatus: "Viúvo(a)", showRelationshipStatus: true, avatar: avatar5, photos: [avatar5, avatar7], isOnline: true },
  { id: "6", name: "Thiago Costa", age: 24, gender: "Masculino", interest: "Homens", city: "Fortaleza", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: avatar6, photos: [avatar6], isOnline: false, lastSeen: "há 30min" },
  { id: "7", name: "Juliana Ribeiro", age: 27, gender: "Feminino", interest: "Homens", city: "Porto Alegre", relationshipStatus: "Enrolado(a)", showRelationshipStatus: true, avatar: avatar7, photos: [avatar7, avatar1, avatar3], isOnline: true },
  { id: "8", name: "Marcos Pereira", age: 32, gender: "Masculino", interest: "Mulheres", city: "Recife", relationshipStatus: "Casado(a)", showRelationshipStatus: false, avatar: avatar8, photos: [avatar8, avatar2], isOnline: false, lastSeen: "há 5h" },
  { id: "9", name: "Beatriz Almeida", age: 23, gender: "Feminino", interest: "Mulheres", city: "Manaus", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: avatar3, photos: [avatar3], isOnline: true },
  { id: "10", name: "Diego Souza", age: 29, gender: "Masculino", interest: "Ambos", city: "Goiânia", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: avatar6, photos: [avatar6, avatar4], isOnline: true },
  { id: "11", name: "Priscila Martins", age: 26, gender: "Feminino", interest: "Homens", city: "Brasília", relationshipStatus: "Namorando", showRelationshipStatus: true, avatar: avatar1, photos: [avatar1], isOnline: false, lastSeen: "há 1h" },
  { id: "12", name: "André Nascimento", age: 31, gender: "Masculino", interest: "Mulheres", city: "Campinas", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: avatar4, photos: [avatar4], isOnline: true },
  // Perfis fictícios com fotos reais
  { id: "13", name: "Erivaldo Souza Bonfim", age: 52, gender: "Masculino", interest: "Mulheres", city: "Itabuna", relationshipStatus: "Separado(a)", showRelationshipStatus: true, avatar: profileM1, photos: [profileM1], isOnline: false, lastSeen: "há 15min" },
  { id: "14", name: "Zenaide Teixeira Lopes", age: 42, gender: "Feminino", interest: "Homens", city: "Bauru", relationshipStatus: "Viúvo(a)", showRelationshipStatus: true, avatar: profileF1, photos: [profileF1], isOnline: false, lastSeen: "há 45min" },
  { id: "15", name: "Rosimeire Farias Queiroz", age: 44, gender: "Feminino", interest: "Homens", city: "Imperatriz", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileF2, photos: [profileF2], isOnline: false, lastSeen: "há 1h" },
  { id: "16", name: "Genivaldo Ramos Teles", age: 47, gender: "Masculino", interest: "Mulheres", city: "Montes Claros", relationshipStatus: "Casado(a)", showRelationshipStatus: false, avatar: profileM2, photos: [profileM2], isOnline: false, lastSeen: "há 2h" },
  { id: "17", name: "Edileusa Moreira Gomes", age: 36, gender: "Feminino", interest: "Homens", city: "Arapiraca", relationshipStatus: "Enrolado(a)", showRelationshipStatus: true, avatar: profileF3, photos: [profileF3], isOnline: false, lastSeen: "há 30min" },
  { id: "18", name: "Cleiton Bastos Nogueira", age: 38, gender: "Masculino", interest: "Mulheres", city: "Ji-Paraná", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileM3, photos: [profileM3], isOnline: false, lastSeen: "há 3h" },
  { id: "19", name: "Neusa Aparecida Braga", age: 55, gender: "Feminino", interest: "Homens", city: "Três Lagoas", relationshipStatus: "Viúvo(a)", showRelationshipStatus: true, avatar: profileF4, photos: [profileF4], isOnline: false, lastSeen: "há 4h" },
  { id: "20", name: "Edenilson Prado Meireles", age: 45, gender: "Masculino", interest: "Mulheres", city: "Parnaíba", relationshipStatus: "Namorando", showRelationshipStatus: true, avatar: profileM4, photos: [profileM4], isOnline: false, lastSeen: "há 1h" },
  { id: "21", name: "Josenildo Tavares Cruz", age: 35, gender: "Masculino", interest: "Mulheres", city: "Caruaru", relationshipStatus: "Separado(a)", showRelationshipStatus: true, avatar: profileM5, photos: [profileM5], isOnline: false, lastSeen: "há 6h" },
  { id: "22", name: "Valdirene Coelho Batista", age: 39, gender: "Feminino", interest: "Homens", city: "Sobral", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileF5, photos: [profileF5], isOnline: false, lastSeen: "há 20min" },
  { id: "23", name: "Haroldo Siqueira", age: 40, gender: "Masculino", interest: "Mulheres", city: "Uberaba", relationshipStatus: "Separado(a)", showRelationshipStatus: true, avatar: profileM6, photos: [profileM6], isOnline: false, lastSeen: "há 10min" },
  { id: "24", name: "Ednaldo Conceição Freitas", age: 43, gender: "Masculino", interest: "Mulheres", city: "Ilhéus", relationshipStatus: "Casado(a)", showRelationshipStatus: false, avatar: profileM7, photos: [profileM7], isOnline: false, lastSeen: "há 50min" },
  { id: "25", name: "Wanderson Lacerda", age: 28, gender: "Masculino", interest: "Mulheres", city: "Marabá", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileM8, photos: [profileM8], isOnline: false, lastSeen: "há 25min" },
  { id: "26", name: "Iracema Vidal", age: 24, gender: "Feminino", interest: "Homens", city: "Chapecó", relationshipStatus: "Namorando", showRelationshipStatus: true, avatar: profileF6, photos: [profileF6], isOnline: false, lastSeen: "há 2h" },
  { id: "27", name: "Otoniel Brito Cavalcante", age: 33, gender: "Masculino", interest: "Mulheres", city: "Altamira", relationshipStatus: "Enrolado(a)", showRelationshipStatus: true, avatar: profileM9, photos: [profileM9], isOnline: false, lastSeen: "há 1h" },
  { id: "28", name: "Tainá Felício Rezende", age: 30, gender: "Feminino", interest: "Homens", city: "Juazeiro do Norte", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileF7, photos: [profileF7], isOnline: false, lastSeen: "há 35min" },
  { id: "29", name: "Kleberson Duarte", age: 21, gender: "Masculino", interest: "Mulheres", city: "Boa Vista", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileM10, photos: [profileM10], isOnline: false, lastSeen: "há 5min" },
  { id: "30", name: "Nilton Assunção Borges", age: 58, gender: "Masculino", interest: "Mulheres", city: "Poços de Caldas", relationshipStatus: "Viúvo(a)", showRelationshipStatus: true, avatar: profileM11, photos: [profileM11], isOnline: false, lastSeen: "há 3h" },
  { id: "31", name: "Keila Yoshida Ferraz", age: 29, gender: "Feminino", interest: "Homens", city: "Londrina", relationshipStatus: "Separado(a)", showRelationshipStatus: true, avatar: profileF8, photos: [profileF8], isOnline: false, lastSeen: "há 40min" },
  { id: "32", name: "Mirela Brandão", age: 22, gender: "Feminino", interest: "Homens", city: "Petrolina", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileF9, photos: [profileF9], isOnline: false, lastSeen: "há 15min" },
  { id: "33", name: "Graciele Sampaio", age: 34, gender: "Feminino", interest: "Homens", city: "Tangará da Serra", relationshipStatus: "Separado(a)", showRelationshipStatus: true, avatar: profileF10, photos: [profileF10], isOnline: false, lastSeen: "há 8min" },
  { id: "34", name: "Suelen Pimentel Rocha", age: 26, gender: "Feminino", interest: "Homens", city: "Tucuruí", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileF11, photos: [profileF11], isOnline: false, lastSeen: "há 12min" },
  { id: "35", name: "Daiany Esteves", age: 25, gender: "Feminino", interest: "Homens", city: "Lavras", relationshipStatus: "Namorando", showRelationshipStatus: true, avatar: profileF12, photos: [profileF12], isOnline: false, lastSeen: "há 55min" },
  { id: "36", name: "Queliane Furtado", age: 28, gender: "Feminino", interest: "Homens", city: "Caxias", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileF13, photos: [profileF13], isOnline: false, lastSeen: "há 30min" },
  { id: "37", name: "Teresinha Amorim Leite", age: 54, gender: "Feminino", interest: "Homens", city: "Patos de Minas", relationshipStatus: "Viúvo(a)", showRelationshipStatus: true, avatar: profileF14, photos: [profileF14], isOnline: false, lastSeen: "há 2h" },
  { id: "38", name: "Leidiane Bispo Cardoso", age: 27, gender: "Feminino", interest: "Homens", city: "Itapetinga", relationshipStatus: "Enrolado(a)", showRelationshipStatus: true, avatar: profileF15, photos: [profileF15], isOnline: false, lastSeen: "há 18min" },
  { id: "39", name: "Giselda Pacheco", age: 48, gender: "Feminino", interest: "Homens", city: "Bagé", relationshipStatus: "Casado(a)", showRelationshipStatus: false, avatar: profileF16, photos: [profileF16], isOnline: false, lastSeen: "há 4h" },
  { id: "40", name: "Joelma Quirino Souza", age: 23, gender: "Feminino", interest: "Homens", city: "Parintins", relationshipStatus: "Solteiro(a)", showRelationshipStatus: true, avatar: profileF17, photos: [profileF17], isOnline: false, lastSeen: "há 1h" },
  { id: "41", name: "Meire Cavalcanti", age: 41, gender: "Feminino", interest: "Homens", city: "Mossoró", relationshipStatus: "Separado(a)", showRelationshipStatus: true, avatar: profileF18, photos: [profileF18], isOnline: false, lastSeen: "há 45min" },
  { id: "42", name: "Rosângela Torquato Melo", age: 44, gender: "Feminino", interest: "Homens", city: "Araguaína", relationshipStatus: "Namorando", showRelationshipStatus: true, avatar: profileF19, photos: [profileF19], isOnline: false, lastSeen: "há 22min" },
];

export const conversations: Conversation[] = [
  { id: "c1", participantId: "1", lastMessage: "Oi, tudo bem? 😊", lastMessageTime: "2min", unreadCount: 2 },
  { id: "c2", participantId: "3", lastMessage: "Vamos sair hoje?", lastMessageTime: "15min", unreadCount: 0 },
  { id: "c3", participantId: "5", lastMessage: "Que foto linda!", lastMessageTime: "1h", unreadCount: 1 },
  { id: "c4", participantId: "7", lastMessage: "Bom dia! ☀️", lastMessageTime: "3h", unreadCount: 0 },
  { id: "c5", participantId: "4", lastMessage: "Haha, muito engraçado 😂", lastMessageTime: "5h", unreadCount: 0 },
  { id: "c6", participantId: "2", lastMessage: "Vou te mandar as fotos", lastMessageTime: "1d", unreadCount: 0 },
  { id: "c7", participantId: "8", lastMessage: "Valeu, obrigado!", lastMessageTime: "2d", unreadCount: 0 },
  { id: "c8", participantId: "6", lastMessage: "Até mais! 👋", lastMessageTime: "3d", unreadCount: 0 },
];

export const generalChatMessages: Message[] = [
  { id: "g1", conversationId: "general", senderId: "1", text: "Oi gente! Alguém de SP aqui? 😊", timestamp: "13:00", isRead: true },
  { id: "g2", conversationId: "general", senderId: "2", text: "Eu! Sou de SP sim!", timestamp: "13:02", isRead: true },
  { id: "g3", conversationId: "general", senderId: "5", text: "Boa tarde pessoal! Sou de Salvador 🌴", timestamp: "13:05", isRead: true },
  { id: "g4", conversationId: "general", senderId: "3", text: "Que legal, adoro Salvador! Quero visitar um dia", timestamp: "13:07", isRead: true },
  { id: "g5", conversationId: "general", senderId: "7", text: "Alguém quer bater papo? Tô entediada 😅", timestamp: "13:10", isRead: true },
  { id: "g6", conversationId: "general", senderId: "10", text: "Eu aceito! De onde você é?", timestamp: "13:12", isRead: true },
  { id: "g7", conversationId: "general", senderId: "7", text: "Porto Alegre! E vc?", timestamp: "13:13", isRead: true },
  { id: "g8", conversationId: "general", senderId: "10", text: "Goiânia! Prazer 🤝", timestamp: "13:14", isRead: true },
  { id: "g9", conversationId: "general", senderId: "12", text: "Eae galera, bom dia pra quem tá chegando agora!", timestamp: "13:20", isRead: true },
  { id: "g10", conversationId: "general", senderId: "9", text: "Bom diaa! ☀️ Primeira vez aqui no WoomChat", timestamp: "13:22", isRead: true },
  { id: "g11", conversationId: "general", senderId: "1", text: "Bem-vinda Beatriz! Aqui é muito legal 💜", timestamp: "13:25", isRead: true },
  { id: "g12", conversationId: "general", senderId: "4", text: "Alguém de Curitiba? Bora marcar um café ☕", timestamp: "13:30", isRead: true },
];

export const messagesByConversation: Record<string, Message[]> = {
  c1: [
    { id: "m1", conversationId: "c1", senderId: "1", text: "Oi! Vi seu perfil e achei super interessante 😊", timestamp: "14:30", isRead: true },
    { id: "m2", conversationId: "c1", senderId: "me", text: "Oi Camila! Obrigado, o seu também é muito legal!", timestamp: "14:32", isRead: true },
    { id: "m3", conversationId: "c1", senderId: "1", text: "Você é de São Paulo mesmo?", timestamp: "14:33", isRead: true },
    { id: "m4", conversationId: "c1", senderId: "me", text: "Sim! E você do Rio, né? Adoro o Rio!", timestamp: "14:35", isRead: true },
    { id: "m5", conversationId: "c1", senderId: "1", text: "Sim! Aqui é maravilhoso. Você deveria visitar 😄", timestamp: "14:36", isRead: true },
    { id: "m6", conversationId: "c1", senderId: "1", text: "Oi, tudo bem? 😊", timestamp: "14:50", isRead: false },
  ],
  c2: [
    { id: "m7", conversationId: "c2", senderId: "me", text: "E aí Aline, como vai?", timestamp: "12:00", isRead: true },
    { id: "m8", conversationId: "c2", senderId: "3", text: "Tudo ótimo! E você?", timestamp: "12:05", isRead: true },
    { id: "m9", conversationId: "c2", senderId: "me", text: "Também! O que vai fazer hoje?", timestamp: "12:10", isRead: true },
    { id: "m10", conversationId: "c2", senderId: "3", text: "Vamos sair hoje?", timestamp: "12:15", isRead: true },
  ],
  c3: [
    { id: "m11", conversationId: "c3", senderId: "5", text: "Oi! Adorei suas fotos!", timestamp: "11:00", isRead: true },
    { id: "m12", conversationId: "c3", senderId: "me", text: "Obrigado Fernanda! As suas também são lindas!", timestamp: "11:05", isRead: true },
    { id: "m13", conversationId: "c3", senderId: "5", text: "Que foto linda!", timestamp: "11:30", isRead: false },
  ],
};

// Fake users for new registration cards
const femaleNames = [
  "Paula Pereira", "Amanda Rocha", "Larissa Campos", "Isabela Nunes",
  "Carolina Vieira", "Natália Gomes", "Letícia Duarte", "Vanessa Castro",
  "Bruna Correia", "Mariana Teixeira", "Renata Machado",
];

const maleNames = [
  "Bruno Silva", "Gabriel Araújo", "Mateus Cardoso", "Pedro Henrique",
  "Rodrigo Barbosa", "Felipe Moraes", "Leonardo Reis", "Gustavo Pinto",
  "Caio Monteiro", "Diego Fernandes",
];

const femaleAvatarIndices = [0, 2, 4, 6]; // avatar1, avatar3, avatar5, avatar7
const maleAvatarIndices = [1, 3, 5, 7];   // avatar2, avatar4, avatar6, avatar8

const cities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Brasília",
  "Curitiba", "Fortaleza", "Recife", "Porto Alegre", "Manaus",
  "Goiânia", "Campinas", "Guarulhos", "Florianópolis", "Vitória",
];

const statuses: RelationshipStatus[] = ["Solteiro(a)", "Casado(a)", "Separado(a)", "Namorando", "Viúvo(a)", "Enrolado(a)"];

export function generateRandomNewUser() {
  const isFemale = Math.random() > 0.5;
  const gender: Gender = isFemale ? "Feminino" : "Masculino";
  const names = isFemale ? femaleNames : maleNames;
  const avatarPool = isFemale ? femaleAvatarIndices : maleAvatarIndices;

  const name = names[Math.floor(Math.random() * names.length)];
  const age = Math.floor(Math.random() * 20) + 20;
  const city = cities[Math.floor(Math.random() * cities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const avatarIdx = avatarPool[Math.floor(Math.random() * avatarPool.length)];

  return {
    id: `fake-${Date.now()}-${Math.random()}`,
    name,
    age,
    gender,
    city,
    relationshipStatus: status,
    avatar: avatars[avatarIdx],
  };
}
