'use client';

import ReactMarkdown from 'react-markdown';
import { Message } from '@/lib/types';
import { Dumbbell, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isCoach = message.role === 'coach';

  return (
    <div className={`flex gap-3 ${isCoach ? '' : 'flex-row-reverse'}`}>
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          isCoach ? 'bg-indigo-600' : 'bg-gray-100'
        }`}
      >
        {isCoach
          ? <Dumbbell className="w-3.5 h-3.5 text-white" />
          : <User className="w-3.5 h-3.5 text-gray-500" />
        }
      </div>

      <div className={`max-w-[78%] ${isCoach ? '' : 'items-end'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
            isCoach
              ? 'bg-white border border-gray-100 text-gray-800 shadow-sm'
              : 'bg-indigo-600 text-white'
          }`}
        >
          {isCoach ? (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                code: ({ children }) => (
                  <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <span>{message.content}</span>
          )}
        </div>
        <span className="text-xs text-gray-400 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
        <Dumbbell className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-xl">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
