'use client';

import { UserState } from '@/lib/types';
import { getLevelInfo, getXPProgress } from '@/lib/gamification';
import XPBar from './XPBar';
import { Flame, Star } from 'lucide-react';

interface StatsBarProps {
  userState: UserState;
}

export default function StatsBar({ userState }: StatsBarProps) {
  const levelInfo = getLevelInfo(userState.xp);
  const progress = getXPProgress(userState.xp);

  return (
    <div className="border-b border-gray-100 bg-white px-4 py-2.5">
      <div className="flex items-center gap-4">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
          style={{ backgroundColor: levelInfo.color + '18', color: levelInfo.color }}
        >
          Nv.{levelInfo.level} {levelInfo.name}
        </span>

        <div className="flex-1 min-w-0">
          <XPBar progress={progress} color={levelInfo.color} />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Flame className="w-3 h-3 text-orange-500" />
            <span>{userState.streak}d</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>{userState.xp.toLocaleString('pt-BR')} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
