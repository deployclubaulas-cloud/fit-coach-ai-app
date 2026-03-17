'use client';

import { useEffect, useRef, useState } from 'react';
import { Message } from '@/lib/types';
import ChatMessage, { TypingIndicator } from './ChatMessage';
import { Send, RotateCcw } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (text: string) => void;
  onReset: () => void;
}

export default function ChatInterface({ messages, isLoading, onSend, onReset }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    onSend(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <span className="text-2xl">💪</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Olá! Sou seu FitCoach.</h2>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                Me conte seu peso, altura, objetivo e nível de atividade para começar.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                'Calcular meus macros',
                'Plano de treino para iniciante',
                'Quero perder gordura',
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => onSend(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors shrink-0"
            title="Reiniciar conversa"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              rows={1}
              disabled={isLoading}
              className="w-full resize-none px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400 disabled:opacity-50 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
}
