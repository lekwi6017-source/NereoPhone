import type { Message } from '@/types/models';
import { formatTime } from '@/utils/time';
import { useState } from 'react';

export default function MessageBubble({
  msg,
  onLongPress
}: {
  msg: Message;
  onLongPress?: (e: React.MouseEvent, msg: Message) => void;
}) {
  const isSelf = msg.sender === 'user';
  const align = isSelf ? 'items-end' : 'items-start';
  const bubble =
    'max-w-[75%] p-2 rounded-2xl text-sm ' +
    (isSelf ? 'bg-brand text-white rounded-br-sm' : 'bg-white rounded-bl-sm');

  const [showTrans, setShowTrans] = useState(false);
  const [showFake, setShowFake] = useState(false);

  const press = (e: any) => onLongPress?.(e, msg);

  return (
    <div className={`flex flex-col ${align} gap-1`}>
      <div className="text-[10px] text-gray-400">{formatTime(msg.timestamp)}</div>
      <div onContextMenu={(e)=>{ e.preventDefault(); press(e); }} onMouseDown={(e)=> e.button===2 && press(e)}>
        {msg.type === 'text' && <div className={bubble}>{msg.text}</div>}

        {msg.type === 'image' && (
          <img src={msg.url} className="max-w-[75%] rounded-2xl border" />
        )}

        {msg.type === 'emoji' && (
          <div className={bubble}>
            <span className="text-2xl mr-2">🧿</span>
            {msg.name}
          </div>
        )}

        {msg.type === 'redpacket' && (
          <div className={`${bubble} bg-red-500`}>
            <div className="text-xs opacity-90">红包 · {msg.from === 'user' ? '你发出' : '对方向你'}</div>
            <div className="text-lg font-bold">¥ {msg.amount}</div>
            {msg.note && <div className="opacity-90 mt-1">{msg.note}</div>}
          </div>
        )}

        {msg.type === 'voice' && (
          <div className={`${bubble} bg-indigo-500`}>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 text-xs bg-white/20 rounded"
                onClick={() => {
                  const a = new Audio(msg.url);
                  a.play();
                }}
              >
                ▶︎ {msg.duration}s
              </button>
              <button
                className="text-[11px] underline"
                onClick={() => setShowTrans((v) => !v)}
              >
                {showTrans ? '隐藏转写' : '显示转写'}
              </button>
            </div>
            {showTrans && <div className="mt-1 text-xs opacity-95">{msg.transcription}</div>}
          </div>
        )}

        {msg.type === 'fake_voice' && (
          <div className={`${bubble} bg-amber-500`}>
            <div className="flex items-center gap-2">
              <span>◼︎ 伪语音条</span>
              <span className="text-xs">{msg.duration}s</span>
              <button
                className="text-[11px] underline"
                onClick={() => setShowFake((v) => !v)}
              >
                {showFake ? '隐藏内容' : '显示内容'}
              </button>
            </div>
            {showFake && <div className="mt-1 text-xs opacity-95">{msg.hiddenText}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
