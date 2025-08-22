import type { Message, TextMsg, FakeVoiceMsg, RedPacketMsg, VoiceMsg } from '@/types/models';
import { ts } from '@/utils/time';

const proxy = import.meta.env.VITE_API_PROXY_URL as string | undefined;

// 关键词触发示例
function mockAI(pendingChunks: string[]): Message[] {
  const now = ts();
  const text = pendingChunks.join('\n').trim();

  const out: Message[] = [];

  // 简单触发：红包 / 表情 / 伪语音 / 真语音
  if (/红包|red\s?packet|lucky/i.test(text)) {
    const rp: RedPacketMsg = {
      id: 'ai-rp-' + now,
      sender: 'ai',
      type: 'redpacket',
      timestamp: now,
      amount: Math.floor(Math.random() * 50) + 1,
      note: '恭喜发财',
      from: 'ai'
    };
    out.push(rp);
  }

  if (/语音|voice/i.test(text)) {
    const v: VoiceMsg = {
      id: 'ai-voice-' + now,
      sender: 'ai',
      type: 'voice',
      timestamp: now + 10,
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/En-us-hello.ogg',
      duration: 1,
      transcription: 'Hello（示例转写）'
    };
    out.push(v);
  }

  if (/伪|fake/i.test(text)) {
    const fv: FakeVoiceMsg = {
      id: 'ai-fv-' + now,
      sender: 'ai',
      type: 'fake_voice',
      timestamp: now + 20,
      duration: 2,
      hiddenText: '（伪语音）其实我在读这段隐藏文本。'
    };
    out.push(fv);
  }

  // 默认回文本
  const reply: TextMsg = {
    id: 'ai-text-' + (now + 30),
    sender: 'ai',
    type: 'text',
    timestamp: now + 30,
    text:
      out.length === 0
        ? '收到。你说的我都记下了。（Mock 回复）'
        : '以及：补充点想法。（Mock 文本）'
  };
  out.push(reply);

  return out;
}

export async function chatOnce(opts: {
  history: Message[];
  pendingBuffer: string[];
  prompts: string[];
  personaPrompt?: string;
  now: number;
}): Promise<Message[]> {
  const { history, pendingBuffer, prompts, personaPrompt, now } = opts;
  // 真实代理（你自己的后端：负责拼接 prompt、调用大模型，然后返回 Message[]）
  if (proxy) {
    try {
      const res = await fetch(`${proxy}/chat-once`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, pendingBuffer, prompts, personaPrompt, now })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data as Message[];
        if (data?.messages) return data.messages as Message[];
      }
    } catch {
      // 失败则降级到 Mock
    }
  }
  // Mock
  return Promise.resolve(mockAI(pendingBuffer));
}
