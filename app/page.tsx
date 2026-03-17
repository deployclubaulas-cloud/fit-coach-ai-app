'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import UserSetup from '@/components/UserSetup';
import ChatInterface from '@/components/ChatInterface';
import GamificationPanel from '@/components/GamificationPanel';
import StatsBar from '@/components/StatsBar';
import { Message, UserState } from '@/lib/types';
import { sendMessage } from '@/lib/api';
import {
  loadState,
  saveState,
  clearState,
  getDefaultState,
  recordMessage,
} from '@/lib/gamification';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'coach',
  content:
    'Olá! Sou seu FitCoach AI 💪\n\nPara personalizar suas recomendações, me conte:\n- **Peso** (kg)\n- **Altura** (cm)\n- **Objetivo** (perder gordura / ganhar massa / manter)\n- **Nível de atividade** (sedentário / moderado / ativo)\n\nOu pode me fazer qualquer pergunta sobre nutrição e treino!',
  timestamp: new Date(),
};

export default function Home() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [xpFlash, setXpFlash] = useState(0);
  const [mounted, setMounted] = useState(false);
  const xpFlashTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setMounted(true);
    const saved = loadState();
    if (saved) setUserState(saved);
  }, []);

  const handleSetupComplete = useCallback((userName: string, sessionId: string) => {
    const state = getDefaultState(sessionId, userName);
    saveState(state);
    setUserState(state);
  }, []);

  const handleLogout = useCallback(() => {
    clearState();
    setUserState(null);
    setMessages([WELCOME_MESSAGE]);
  }, []);

  const triggerXPFlash = useCallback((amount: number) => {
    setXpFlash(amount);
    clearTimeout(xpFlashTimer.current);
    xpFlashTimer.current = setTimeout(() => setXpFlash(0), 1200);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    if (!userState) return;

    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const { newState, xpEvents } = recordMessage(userState);
    setUserState(newState);
    saveState(newState);

    if (xpEvents.length > 0) {
      triggerXPFlash(xpEvents.reduce((sum, e) => sum + e.amount, 0));
    }

    try {
      const data = await sendMessage(text, userState.sessionId, userState.userName);

      const coachMsg: Message = {
        id: uuidv4(),
        role: 'coach',
        content: data.response,
        timestamp: new Date(),
      };

      if (data.type === 'reset') {
        setMessages([coachMsg]);
      } else {
        setMessages(prev => [...prev, coachMsg]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          role: 'coach',
          content: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [userState, triggerXPFlash]);

  const handleReset = useCallback(() => {
    handleSend('/reset');
  }, [handleSend]);

  if (!mounted) return null;

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA] overflow-hidden">
      {!userState && <UserSetup onComplete={handleSetupComplete} />}

      <Header userState={userState} onLogout={handleLogout} />

      {userState && (
        <div className="lg:hidden">
          <StatsBar userState={userState} />
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        <main className="flex flex-1 flex-col min-w-0 min-h-0">
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSend={handleSend}
            onReset={handleReset}
          />
        </main>

        {userState && (
          <div className="hidden lg:flex">
            <GamificationPanel userState={userState} xpFlash={xpFlash} />
          </div>
        )}
      </div>
    </div>
  );
}
