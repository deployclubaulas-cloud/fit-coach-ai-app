export type MessageRole = 'user' | 'coach';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface UserState {
  sessionId: string;
  userName: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null; // ISO date string YYYY-MM-DD
  messagesCount: number;
  profileCompleted: boolean;
  todayXP: number;
  todayDate: string | null;
  achievements: string[];
}

export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Rookie',    minXP: 0,     maxXP: 499,   color: '#6B7280' },
  { level: 2, name: 'Active',    minXP: 500,   maxXP: 1499,  color: '#10B981' },
  { level: 3, name: 'Dedicated', minXP: 1500,  maxXP: 3499,  color: '#6366F1' },
  { level: 4, name: 'Athlete',   minXP: 3500,  maxXP: 7499,  color: '#F59E0B' },
  { level: 5, name: 'Elite',     minXP: 7500,  maxXP: 99999, color: '#EF4444' },
];

export const ACHIEVEMENTS = [
  { id: 'first_message',  label: 'First Step',     icon: '🏁', description: 'Enviou a primeira mensagem' },
  { id: 'profile_done',   label: 'Profile Set',    icon: '📋', description: 'Completou o perfil fitness' },
  { id: 'streak_3',       label: '3-Day Streak',   icon: '🔥', description: '3 dias consecutivos' },
  { id: 'streak_7',       label: 'Week Warrior',   icon: '⚡', description: '7 dias consecutivos' },
  { id: 'messages_10',    label: 'Getting Started', icon: '💬', description: '10 mensagens enviadas' },
  { id: 'messages_50',    label: 'Committed',      icon: '🎯', description: '50 mensagens enviadas' },
  { id: 'level_2',        label: 'Going Active',   icon: '🟢', description: 'Alcançou o nível Active' },
  { id: 'level_3',        label: 'Dedicated',      icon: '💜', description: 'Alcançou o nível Dedicated' },
];
