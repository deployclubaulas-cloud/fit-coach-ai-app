'use client';

import { useEffect, useState } from 'react';

interface XPBarProps {
  progress: number; // 0–100
  color: string;
}

export default function XPBar({ progress, color }: XPBarProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(progress), 50);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${displayed}%`, backgroundColor: color }}
      />
    </div>
  );
}
