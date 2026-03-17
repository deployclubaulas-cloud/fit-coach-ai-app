'use client';

import { UserState, LEVELS } from '@/lib/types';
import { getLevelInfo, getXPProgress, getAchievementDetails } from '@/lib/gamification';
import XPBar from './XPBar';
import { Flame, MessageSquare, Star, Trophy, Zap } from 'lucide-react';

interface GamificationPanelProps {
  userState: UserState;
  xpFlash?: number;
}

export default function GamificationPanel({ userState, xpFlash }: GamificationPanelProps) {
  const levelInfo = getLevelInfo(userState.xp);
  const progress = getXPProgress(userState.xp);
  const nextLevel = LEVELS.find(l => l.level === levelInfo.level + 1);

  const xpToNext = nextLevel
    ? nextLevel.minXP - userState.xp
    : null;

  return (
    <aside className="w-72 shrink-0 border-l border-gray-100 bg-white flex flex-col overflow-y-auto">
      <div className="p-5 border-b border-gray-50">
        {/* Level badge */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: levelInfo.color + '18', color: levelInfo.color }}
              >
                Nível {levelInfo.level} · {levelInfo.name}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {userState.xp.toLocaleString('pt-BR')}
              <span className="text-sm font-normal text-gray-400 ml-1">XP</span>
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: levelInfo.color + '18' }}
          >
            {levelInfo.level === 1 ? '🏁' : levelInfo.level === 2 ? '🟢' : levelInfo.level === 3 ? '💜' : levelInfo.level === 4 ? '🏆' : '⚡'}
          </div>
        </div>

        <XPBar progress={progress} color={levelInfo.color} />

        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-400">{progress}%</span>
          {xpToNext !== null ? (
            <span className="text-xs text-gray-400">{xpToNext.toLocaleString('pt-BR')} XP para {nextLevel?.name}</span>
          ) : (
            <span className="text-xs text-gray-400">Nível máximo</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 border-b border-gray-50">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stats</h3>
        <div className="space-y-2.5">
          <StatRow
            icon={<Flame className="w-3.5 h-3.5 text-orange-500" />}
            label="Streak"
            value={`${userState.streak} dia${userState.streak !== 1 ? 's' : ''}`}
            bg="bg-orange-50"
          />
          <StatRow
            icon={<MessageSquare className="w-3.5 h-3.5 text-indigo-500" />}
            label="Mensagens"
            value={userState.messagesCount.toString()}
            bg="bg-indigo-50"
          />
          <StatRow
            icon={<Star className="w-3.5 h-3.5 text-yellow-500" />}
            label="XP hoje"
            value={`+${userState.todayXP}`}
            bg="bg-yellow-50"
            highlight={!!xpFlash}
          />
          <StatRow
            icon={<Zap className="w-3.5 h-3.5 text-emerald-500" />}
            label="Perfil"
            value={userState.profileCompleted ? 'Completo ✓' : 'Incompleto'}
            bg="bg-emerald-50"
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="p-5 flex-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Conquistas
          <span className="ml-2 text-gray-300 font-normal normal-case">
            {userState.achievements.length}/8
          </span>
        </h3>
        <div className="space-y-2">
          {['first_message', 'profile_done', 'streak_3', 'streak_7', 'messages_10', 'messages_50', 'level_2', 'level_3'].map(id => {
            const details = getAchievementDetails(id);
            const earned = userState.achievements.includes(id);
            if (!details) return null;
            return (
              <div
                key={id}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-colors ${
                  earned ? 'bg-gray-50' : 'opacity-40'
                }`}
              >
                <span className={`text-base ${!earned ? 'grayscale' : ''}`}>{details.icon}</span>
                <div>
                  <p className={`text-xs font-medium ${earned ? 'text-gray-900' : 'text-gray-400'}`}>{details.label}</p>
                  <p className="text-xs text-gray-400">{details.description}</p>
                </div>
                {earned && <Trophy className="w-3 h-3 text-yellow-500 ml-auto shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function StatRow({
  icon, label, value, bg, highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-2.5 rounded-lg ${bg} transition-all ${highlight ? 'scale-[1.02]' : ''}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-gray-600">{label}</span>
      </div>
      <span className="text-xs font-semibold text-gray-900">{value}</span>
    </div>
  );
}
