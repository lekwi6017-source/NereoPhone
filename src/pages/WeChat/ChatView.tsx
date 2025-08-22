import { useParams } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import type { Conversation, Message, FakeVoiceMsg, RedPacketMsg, TextMsg } from '@/types/models';
import { ts } from '@/utils/time';
import MessageBubble from '@/components/MessageBubble';
import ContextMenu from '@/components/ContextMenu';
import Modal from '@/components/Modal';
import { chatOnce } from '@/api/chat';

export default function ChatView() {
  const { id } = useParams();
  const { state, setState, activeConv, upsertConversation, pushMessage, persistAll } = useStore();
  const [text, setText] = useState('');
  const [showPlus, setShowPlus] = useState(false);

  const conv = useMemo<Conversation | undefined>(
    () => state.conversations.find((c) => c.id === id),
    [state.conversations, id]
  );

  // 第一次进入时，若无会话则创建
  if (!conv && id) {
    const now = ts();
    upsertConversation({
      id,
      roleId: state.profile?.activePersonaId || '',
      messages: [],
      pendingUserBuffer: [],
      createdAt: now,
      updatedAt: now
    });
  }

  const listRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ open: boolean; x: number; y: number; msg?: Message }>({
    open: false,
    x: 0,
    y: 0
  });

  function scrollBottom() {
    requestAnimationFrame(() => listRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }));
  }

  function sendText() {
    if (!id || !conv || !text.trim()) return;
    const msg: TextMsg = {
      id: 'u-' + ts(),
      sender: 'user',
      type: 'text',
      timestamp: ts(),
      text: text.trim()
    };
    // “发送”：只 push 到消息 + 缓存 pending
    pushMessage(id, msg);
    setState((s) => {
      const i = s.conversations.findIndex((c) => c.id === id);
      const c = { ...s.conversations[i] };
      c.pendingUserBuffer = [...c.pendingUserBuffer, msg.text];
      const arr = [...s.conversations];
      arr[i] = c;
      return { ...s, conversations: arr };
    });
    setText('');
    scrollBottom();
    persistAll();
  }

  async function receiveAI() {
    if (!id || !conv) return;
    const now = ts();
    const personaPrompt =
      state.profile?.personas.find((p) => p.id === state.profile?.activePersonaId)?.prompt || '';
    const prompts = state.prompts.map((p) => p.content);
    const messages = await chatOnce({
      history: conv.messages,
      pendingBuffer: conv.pendingUserBuffer,
      prompts,
      personaPrompt,
      now
    });
    // 清空 pending，追加 AI 气泡
    setState((s) => {
      const i = s.conversations.findIndex((c) => c.id === id);
      const c = { ...s.conversations[i] };
      c.pendingUserBuffer = [];
      c.messages = [...c.messages, ...messages];
      c.updatedAt = ts();
      const arr = [...s.conversations];
      arr[i] = c;
      return { ...s, conversations: arr };
    });
    scrollBottom();
    persistAll();
  }

  function addRedPacket() {
    if (!id) return;
    const msg: RedPacketMsg = {
      id: 'rp-' + ts(),
      sender: 'user',
      type: 'redpacket',
      timestamp: ts(),
      amount: Math.floor(Math.random() * 66) + 1,
      note: '小小心意',
      from: 'user'
    };
    pushMessage(id, msg);
    scrollBottom();
  }

  function addFakeVoice() {
    if (!id) return;
    const msg: FakeVoiceMsg = {
      id: 'fv-' + ts(),
      sender: 'user',
      type: 'fake_voice',
      timestamp: ts(),
      duration: Math.floor(Math.random() * 5) + 1,
      hiddenText: text.trim() || '（空）'
    };
    pushMessage(id, msg);
    // 伪语音用于“把字当语音放出”，不进入 pending
    setText('');
    scrollBottom();
  }

  if (!id) return null;

  return (
    <div className="min-h-full pb-28">
      <header className="h-12 px-4 flex items-center gap-3 border-b sticky top-0 bg-white z-10">
        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">🤖</div>
        <div className="font-semibold">会话 {id.slice(-4)}</div>
        <div className="ml-auto text-sm text-gray-500">右上角预留：角色/头像/气泡色/Prompt 勾选</div>
      </header>

      <div ref={listRef} className="p-3 flex flex-col gap-3 overflow-y-auto" style={{ height: 'calc(100dvh - 12rem)' }}>
        {conv?.messages.map((m) => (
          <div
            key={m.id}
            className={m.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            <MessageBubble
              msg={m}
              onLongPress={(e, msg) =>
                setMenu({ open: true, x: e.clientX, y: e.clientY, msg })
              }
            />
          </div>
        ))}
      </div>

      <ContextMenu
        open={menu.open}
        x={menu.x}
        y={menu.y}
        onClose={() => setMenu((s) => ({ ...s, open: false }))}
        onAction={(act) => {
          if (!menu.msg || !conv) return;
          if (act === 'copy') navigator.clipboard.writeText((menu.msg as any).text ?? `[${menu.msg.type}]`);
          if (act === 'delete') {
            // 简易删除
            setState((s) => {
              const i = s.conversations.findIndex((c) => c.id === conv.id);
              const c = { ...s.conversations[i] };
              c.messages = c.messages.filter((x) => x.id !== menu.msg!.id);
              const arr = [...s.conversations];
              arr[i] = c;
              return { ...s, conversations: arr };
            });
          }
          if (act === 'quote') setText((menu.msg as any).text ? `> ${(menu.msg as any).text}\n` : '> 引用内容\n');
          setMenu((s) => ({ ...s, open: false }));
        }}
      />

      {/* 输入区 */}
      <div className="fixed bottom-14 inset-x-0 bg-white border-t px-3 py-2">
        <div className="flex items-end gap-2">
          <button className="text-2xl" onClick={() => setShowPlus(true)}>＋</button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入内容…（空=接收；有字=发送）"
            rows={1}
            className="flex-1 resize-none rounded-xl border p-2 text-sm max-h-28"
          />
          {text.trim() ? (
            <button className="px-3 py-2 bg-brand text-white rounded-xl" onClick={sendText}>
              发送
            </button>
          ) : (
            <button className="px-3 py-2 bg-indigo-500 text-white rounded-xl" onClick={receiveAI}>
              接收
            </button>
          )}
        </div>
      </div>

      <Modal open={showPlus} onClose={() => setShowPlus(false)} title="更多">
        <div className="grid grid-cols-3 gap-3">
          <button
            className="h-20 rounded-xl bg-rose-50 flex items-center justify-center"
            onClick={() => {
              addRedPacket();
              setShowPlus(false);
            }}
          >
            🧧 红包
          </button>
          <button
            className="h-20 rounded-xl bg-amber-50 flex items-center justify-center"
            onClick={() => {
              addFakeVoice();
              setShowPlus(false);
            }}
          >
            🗣️ 伪语音
          </button>
          <button className="h-20 rounded-xl bg-gray-50 flex items-center justify-center">
            🖼️ 相册（预留）
          </button>
        </div>
      </Modal>
    </div>
  );
}
