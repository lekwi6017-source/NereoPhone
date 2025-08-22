import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useEffect, useMemo, useState } from 'react';
import { ts } from '@/utils/time';
import type { Persona } from '@/types/models';

export default function PersonaEdit() {
  const { id } = useParams<{ id?: string }>();
  const nav = useNavigate();
  const { state, setState, persistAll } = useStore();

  // 先把 profile 收窄
  if (!state.profile) {
    return <div className="p-3 text-sm text-gray-500">正在加载资料…</div>;
  }
  const profile = state.profile;

  // 目标人设（id === 'new' 表示新增）
  const target = useMemo(
    () => profile.personas.find(p => p.id === id),
    [id, profile.personas]
  );

  const [name, setName] = useState<string>(target?.name ?? '');
  const [prompt, setPrompt] = useState<string>(target?.prompt ?? '');

  useEffect(() => {
    const t = profile.personas.find(p => p.id === id);
    setName(t?.name ?? '');
    setPrompt(t?.prompt ?? '');
  }, [id, profile.personas]);

  async function save() {
    const persona: Persona = {
      id: !id || id === 'new' ? `role-${ts()}` : id,
      name: name.trim() || '未命名',
      prompt: prompt.trim(),
    };

    setState(s => {
      if (!s.profile) return s;                 // 二次保护
      const cur = s.profile;
      const list = [...cur.personas];
      const i = list.findIndex(x => x.id === persona.id);
      if (i >= 0) list[i] = persona; else list.unshift(persona);
      return { ...s, profile: { ...cur, personas: list } };
    });

    await persistAll();
    nav('/me');
  }

  return (
    <div className="p-3 space-y-2">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="人设名"
        className="w-full border rounded-lg p-2"
      />
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="人设 Prompt"
        rows={12}
        className="w-full border rounded-lg p-2"
      />
      <div className="flex justify-end">
        <button
          className="px-3 py-1.5 bg-brand text-white rounded-lg text-sm"
          onClick={save}
        >
          保存
        </button>
      </div>
    </div>
  );
}
