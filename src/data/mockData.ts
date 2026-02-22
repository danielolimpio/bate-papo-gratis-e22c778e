import avatar1 from "@/assets/avatars/avatar1.jpg";
import avatar2 from "@/assets/avatars/avatar2.jpg";
import avatar3 from "@/assets/avatars/avatar3.jpg";
import avatar4 from "@/assets/avatars/avatar4.jpg";
import avatar5 from "@/assets/avatars/avatar5.jpg";
import avatar6 from "@/assets/avatars/avatar6.jpg";
import avatar7 from "@/assets/avatars/avatar7.jpg";
import avatar8 from "@/assets/avatars/avatar8.jpg";

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
const fakeNames = [
  "Paula Pereira", "Amanda Rocha", "Bruno Silva", "Larissa Campos",
  "Gabriel Araújo", "Isabela Nunes", "Mateus Cardoso", "Carolina Vieira",
  "Pedro Henrique", "Natália Gomes", "Rodrigo Barbosa", "Letícia Duarte",
  "Felipe Moraes", "Vanessa Castro", "Leonardo Reis", "Bruna Correia",
  "Gustavo Pinto", "Mariana Teixeira", "Caio Monteiro", "Renata Machado",
];

const cities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Brasília",
  "Curitiba", "Fortaleza", "Recife", "Porto Alegre", "Manaus",
  "Goiânia", "Campinas", "Guarulhos", "Florianópolis", "Vitória",
];

const statuses: RelationshipStatus[] = ["Solteiro(a)", "Casado(a)", "Separado(a)", "Namorando", "Viúvo(a)", "Enrolado(a)"];

export function generateRandomNewUser() {
  const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
  const age = Math.floor(Math.random() * 20) + 20;
  const city = cities[Math.floor(Math.random() * cities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const avatarIdx = Math.floor(Math.random() * avatars.length);
  const gender: Gender = Math.random() > 0.5 ? "Feminino" : "Masculino";

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
