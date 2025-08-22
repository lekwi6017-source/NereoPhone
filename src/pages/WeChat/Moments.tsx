import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ts, formatTime } from '@/utils/time';

export default function Moments() {
  const { state, setState, persistAll } = useStore();
  const [text, setText] = useState('');

  function addMoment() {
    if (!text.trim()) return;
    setState((s) => {
      const m = {
        id: 'm-' + ts(),
        author: 'user' as const,
        authorName: '我',
        avatar: s.profile?.avatar || '',
        content: text.trim(),
        images: [],
        timestamp: ts(),
        likedBy: [],
        comments: []
      };
      return { ...s, moments: [m, ...s.moments] };
    });
    setText('');
    persistAll();
    // AI 随机点赞/评论（Mock）
    if (Math.random() > 0.5) {
      setTimeout(() => {
        setState((s) => {
          const arr = [...s.moments];
          arr[0].likedBy.push('ai');
          arr[0].comments.push({
            id: 'c-' + ts(),
            author: 'ai',
            content: '好有感觉。',
            timestamp: ts()
          });
          return { ...s, moments: arr };
        });
        persistAll();
      }, 500);
    }
  }

  return (
    <div className="p-3 space-y-3">
      <div className="bg-white p-3 rounded-xl shadow-sm">
        <textarea
          rows={3}
          value={text}
          placeholder="分享此刻…"
          onChange={(e) => setText(e.target.value)}
          className="w-full resize-none text-sm outline-none"
        />
        <div className="flex justify-end">
          <button onClick={addMoment} className="px-3 py-1.5 bg-brand text-white rounded-lg text-sm">
            发布
          </button>
        </div>
      </div>

      {state.moments.map((m) => (
        <div key={m.id} className="bg-white p-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
              {m.author === 'ai' ? '🤖' : '🙂'}
            </div>
            <div className="text-sm font-medium">{m.authorName}</div>
            <div className="ml-auto text-[10px] text-gray-400">{formatTime(m.timestamp)}</div>
          </div>
          <div className="mt-2 text-sm">{m.content}</div>

          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <button
              onClick={() => {
                setState((s) => {
                  const arr = s.moments.map((x) =>
                    x.id === m.id
                      ? {
                          ...x,
                          likedBy: x.likedBy.includes(s.uid)
                            ? x.likedBy.filter((u) => u !== s.uid)
                            : [...x.likedBy, s.uid]
                        }
                      : x
                  );
                  return { ...s, moments: arr };
                });
                persistAll();
              }}
            >
              👍 {m.likedBy.length}
            </button>
            <span>·</span>
            <button
              onClick={() => {
                const content = prompt('评论：')?.trim();
                if (!content) return;
                setState((s) => {
                  const arr = s.moments.map((x) =>
                    x.id === m.id
                      ? {
                          ...x,
                          comments: [
                            ...x.comments,
                            { id: 'c-' + ts(), author: 'user' as const, content, timestamp: ts() }
                          ]
                        }
                      : x
                  );
                  return { ...s, moments: arr };
                });
                persistAll();
              }}
            >
              💬 {m.comments.length}
            </button>
            <span>·</span>
            <button
              onClick={() => {
                if (!confirm('删除该动态？')) return;
                setState((s) => ({
                  ...s,
                  moments: s.moments.filter((x) => x.id !== m.id)
                }));
                persistAll();
              }}
            >
              删除
            </button>
          </div>

          {m.comments.length > 0 && (
            <div className="mt-2 bg-gray-50 rounded p-2 space-y-1">
              {m.comments.map((c) => (
                <div key={c.id} className="text-xs">
                  <span className="text-gray-800">{c.author === 'ai' ? '🤖' : '我'}：</span>
                  <span>{c.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
