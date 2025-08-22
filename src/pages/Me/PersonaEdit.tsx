import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { ts } from '@/utils/time';

export default function PersonaEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state, setState, persistAll } = useStore();
  const target = state.profile?.personas.find((p) => p.id === id);
  const [name, setName] = useState(target?.name || '');
  const [prompt, setPrompt] = useState(target?.prompt || '');

  useEffect(() => {
    setName(target?.name || '');
    setPrompt(target?.prompt || '');
  }, [id]);

  function save() {
    const doc = {
      id: id === 'new' || !id ? 'role-' + ts() : id!,
      name: name.trim() || '未命名',
      prompt: prompt.trim()
    };
    setState((s) => {
      const profile = { ...(s.profile ?? { uid: s.uid, avatar: '', personas: [] }) };
      const i = profile.personas.findIndex((x) => x.id === doc.id);
      if (i >= 0) profile.personas[i] = doc;
      else profile.personas.unshift(doc);
      return { ...s, profile };
    });
    persistAll();
    nav('/me');
  }

  return (
    <div className="p-3 space-y-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="人设名"
        className="w-full border rounded-lg p-2"
      />
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="人设 Prompt"
        rows={12}
        className="w-full border rounded-lg p-2"
      />
      <div className="flex justify-end">
        <button className="px-3 py-1.5 bg-brand text-white rounded-lg text-sm" onClick={save}>
          保存
        </button>
      </div>
    </div>
  );
}
