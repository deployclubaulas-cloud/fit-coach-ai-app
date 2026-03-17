'use client';

import { useState } from 'react';
import { Dumbbell } from 'lucide-react';

interface UserSetupProps {
  onComplete: (userName: string, sessionId: string) => void;
}

export default function UserSetup({ onComplete }: UserSetupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Digite seu nome'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Email inválido'); return; }
    onComplete(name.trim(), email.trim().toLowerCase());
  };

  return (
    <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">FitCoach AI</h1>
            <p className="text-xs text-gray-500">Seu nutricionista e personal trainer</p>
          </div>
        </div>

        <h2 className="text-base font-medium text-gray-900 mb-1">Bem-vindo</h2>
        <p className="text-sm text-gray-500 mb-6">
          Crie seu perfil para começar. Seu progresso será salvo neste dispositivo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="João Silva"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="joao@email.com"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1.5">Usado como ID de sessão. Nenhum email será enviado.</p>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Começar
          </button>
        </form>
      </div>
    </div>
  );
}
