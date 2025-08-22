import { useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as any) || 'light'
  );

  function apply(t: 'light' | 'dark') {
    setTheme(t);
    localStorage.setItem('theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }

  return (
    <div className="p-3 space-y-3">
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="font-medium mb-2">主题</div>
        <div className="flex gap-2">
          <button
            onClick={() => apply('light')}
            className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'light' ? 'bg-brand text-white' : 'bg-gray-100'}`}
          >
            浅色
          </button>
          <button
            onClick={() => apply('dark')}
            className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-brand text-white' : 'bg-gray-100'}`}
          >
            深色
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="font-medium mb-1">隐藏入口（预留）</div>
        <div className="text-xs text-gray-500">后续挂接：加密页、私密卡片等。</div>
      </div>
    </div>
  );
}
