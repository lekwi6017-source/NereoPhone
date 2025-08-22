import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { ts } from '@/utils/time';

export default function PromptEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state, setState, persistAll } = useStore();
  const target = state.prompts.find((p) => p.id === id);
  const [title, setTitle] = useState(target?.title || '');
  const [content, setContent] = useState(target?.content || '');

  useEffect(() => {
    setTitle(target?.title || '');
    setContent(target?.content || '');
  }, [id]);

  function save() {
    const doc = {
      id: id === 'new' || !id ? 'p-' + ts() : id!,
      title: title.trim() || '未命名',
      content: content.trim()
    };
    setState((s) => {
      const i = s.prompts.findIndex((x) => x.id === doc.id);
      const arr = [...s.prompts];
      if (i >= 0) arr[i] = doc;
      else arr.unshift(doc);
      return { ...s, prompts: arr };
    });
    persistAll();
    nav('/prompts');
  }

  return (
    <div className="p-3 space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="标题"
        className="w-full border rounded-lg p-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="内容"
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
