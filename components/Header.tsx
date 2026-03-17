'use client';

import { Dumbbell, LogOut } from 'lucide-react';
import { UserState } from '@/lib/types';
import { getLevelInfo } from '@/lib/gamification';

interface HeaderProps {
  userState: UserState | null;
  onLogout: () => void;
}

export default function Header({ userState, onLogout }: HeaderProps) {
  const level = userState ? getLevelInfo(userState.xp) : null;

  return (
    <header className="h-14 border-b border-gray-100 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Dumbbell className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900">FitCoach AI</span>
      </div>

      {userState && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {level && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: level.color + '18', color: level.color }}
              >
                {level.name}
              </span>
            )}
            <span className="text-xs text-gray-500">{userState.userName}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
