import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';

export default function PromptList() {
  const { state, setState, persistAll } = useStore();

  function del(id: string) {
    setState((s) => ({ ...s, prompts: s.prompts.filter((p) => p.id !== id) }));
    persistAll();
  }

  return (
    <div className="p-3 space-y-3 pb-16">
      <div className="flex justify-end">
        <Link to="/prompts/edit/new" className="px-3 py-1.5 bg-brand text-white rounded-lg text-sm">
          新建
        </Link>
      </div>

      {state.prompts.map((p) => (
        <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="font-medium">{p.title}</div>
            <div className="ml-auto text-xs flex items-center gap-3">
              <Link className="text-brand" to={`/prompts/edit/${p.id}`}>编辑</Link>
              <button className="text-red-500" onClick={() => del(p.id)}>删除</button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap line-clamp-3">{p.content}</div>
        </div>
      ))}
    </div>
  );
}
