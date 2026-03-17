import { UserState, LEVELS, ACHIEVEMENTS } from './types';

const STORAGE_KEY = 'fitcoach_state';

export const XP_REWARDS = {
  MESSAGE_SENT: 10,
  FIRST_OF_DAY: 25,
  DAILY_STREAK: 50,
  PROFILE_COMPLETE: 100,
};

const today = () => new Date().toISOString().split('T')[0];

export function getDefaultState(sessionId: string, userName: string): UserState {
  return {
    sessionId,
    userName,
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    messagesCount: 0,
    profileCompleted: false,
    todayXP: 0,
    todayDate: today(),
    achievements: [],
  };
}

export function loadState(): UserState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserState;
  } catch {
    return null;
  }
}

export function saveState(state: UserState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getLevelInfo(xp: number) {
  const lvl = LEVELS.slice().reverse().find(l => xp >= l.minXP) ?? LEVELS[0];
  return lvl;
}

export function getXPProgress(xp: number): number {
  const lvl = getLevelInfo(xp);
  if (lvl.level === 5) return 100;
  const range = lvl.maxXP - lvl.minXP + 1;
  const progress = xp - lvl.minXP;
  return Math.min(Math.round((progress / range) * 100), 100);
}

function checkAchievements(state: UserState): string[] {
  const earned: string[] = [];
  const has = (id: string) => state.achievements.includes(id);

  if (!has('first_message') && state.messagesCount >= 1) earned.push('first_message');
  if (!has('profile_done') && state.profileCompleted) earned.push('profile_done');
  if (!has('streak_3') && state.streak >= 3) earned.push('streak_3');
  if (!has('streak_7') && state.streak >= 7) earned.push('streak_7');
  if (!has('messages_10') && state.messagesCount >= 10) earned.push('messages_10');
  if (!has('messages_50') && state.messagesCount >= 50) earned.push('messages_50');
  if (!has('level_2') && state.level >= 2) earned.push('level_2');
  if (!has('level_3') && state.level >= 3) earned.push('level_3');

  return earned;
}

export interface XPEvent {
  type: string;
  amount: number;
}

export function recordMessage(state: UserState): { newState: UserState; xpEvents: XPEvent[] } {
  const d = today();
  const xpEvents: XPEvent[] = [];
  let { xp, streak, lastActiveDate, messagesCount, todayXP, todayDate } = state;

  // Reset todayXP if it's a new day
  if (todayDate !== d) {
    todayXP = 0;
    todayDate = d;
  }

  // Streak logic
  if (lastActiveDate === null) {
    streak = 1;
  } else if (lastActiveDate === d) {
    // Same day — no change
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    streak = lastActiveDate === yStr ? streak + 1 : 1;
    xp += XP_REWARDS.DAILY_STREAK;
    todayXP += XP_REWARDS.DAILY_STREAK;
    xpEvents.push({ type: 'Streak Bonus', amount: XP_REWARDS.DAILY_STREAK });
  }

  // First message of the day
  if (lastActiveDate !== d) {
    xp += XP_REWARDS.FIRST_OF_DAY;
    todayXP += XP_REWARDS.FIRST_OF_DAY;
    xpEvents.push({ type: 'Primeiro do Dia', amount: XP_REWARDS.FIRST_OF_DAY });
  }

  // Per message
  xp += XP_REWARDS.MESSAGE_SENT;
  todayXP += XP_REWARDS.MESSAGE_SENT;
  xpEvents.push({ type: 'Mensagem', amount: XP_REWARDS.MESSAGE_SENT });
  messagesCount += 1;

  const level = getLevelInfo(xp).level;
  const newState: UserState = {
    ...state,
    xp,
    level,
    streak,
    lastActiveDate: d,
    messagesCount,
    todayXP,
    todayDate,
  };

  const newAchievements = checkAchievements(newState);
  newState.achievements = [...state.achievements, ...newAchievements];

  return { newState, xpEvents };
}

export function recordProfileComplete(state: UserState): { newState: UserState; xpEvents: XPEvent[] } {
  if (state.profileCompleted) return { newState: state, xpEvents: [] };
  const xp = state.xp + XP_REWARDS.PROFILE_COMPLETE;
  const todayXP = state.todayXP + XP_REWARDS.PROFILE_COMPLETE;
  const level = getLevelInfo(xp).level;
  const newState: UserState = { ...state, xp, level, todayXP, profileCompleted: true };
  const newAchievements = checkAchievements(newState);
  newState.achievements = [...state.achievements, ...newAchievements];
  return {
    newState,
    xpEvents: [{ type: 'Perfil Completo', amount: XP_REWARDS.PROFILE_COMPLETE }],
  };
}

export function getAchievementDetails(id: string) {
  return ACHIEVEMENTS.find(a => a.id === id);
}
