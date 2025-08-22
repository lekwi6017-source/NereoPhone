import { useStore } from '@/store/useStore';
import { formatTime } from '@/utils/time';
import { Link } from 'react-router-dom';

export default function Chats() {
  const { state } = useStore();
  const { conversations } = state;

  return (
    <div className="p-3 flex flex-col gap-2">
      {conversations.length === 0 && (
        <div className="text-center text-gray-500 text-sm mt-8">暂无会话，去新建一条吧～</div>
      )}
      {conversations.map((c) => {
        const last = c.messages[c.messages.length - 1];
        return (
          <Link
            key={c.id}
            to={`/wechat/chat/${c.id}`}
            className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">🤖</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="font-medium truncate">会话 · {c.roleId || '未绑定'}</div>
                <div className="text-[10px] text-gray-400">{formatTime(c.updatedAt)}</div>
              </div>
              <div className="text-xs text-gray-500 truncate">
                {last ? (last.type === 'text' ? last.text : `[${last.type}]`) : '空会话'}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
