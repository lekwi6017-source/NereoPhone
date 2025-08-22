import { useStore } from '@/store/useStore';
import Uploader from '@/components/Uploader';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MeIndex() {
  const { state, setState, persistAll } = useStore();
  const [name, setName] = useState('我');

  function setAvatar(_key: string, url: string) {
    setState(s => ({
      ...s,
      profile: { ...s.profile, avatar: url },   // 只改 avatar
    }));
    persistAll();
  }

  function bindPersona(personaId: string) {
    setState(s => ({
      ...s,
      profile: { ...s.profile, activePersonaId: personaId },  // 只改 activePersonaId
    }));
    persistAll();
  }

  return (
    <div className="p-3 space-y-3 pb-16">
      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
          {state.profile.avatar ? (
            <img src={state.profile.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">🙂</div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-500">统一头像（影响各处展示）</div>
        </div>
        <Uploader onDone={setAvatar} />
      </div>

      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="font-medium">人设卡</div>
          <Link to="/me/persona/new" className="text-brand text-sm">新建</Link>
        </div>

        <div className="mt-2 space-y-2">
          {state.profile.personas.map(p => (
            <div key={p.id} className="border rounded-lg p-2">
              <div className="flex items-center">
                <div className="font-medium">{p.name}</div>
                <div className="ml-auto text-xs">
                  <button
                    className="text-brand mr-3"
                    onClick={() => bindPersona(p.id)}
                  >
                    绑定到聊天
                  </button>
                  <Link to={`/me/persona/${p.id}`} className="text-brand">编辑</Link>
                </div>
              </div>
              <div className="text-xs text-gray-500 whitespace-pre-wrap mt-1 line-clamp-3">
                {p.prompt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
