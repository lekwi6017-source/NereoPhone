export type MsgType =
  | 'text'
  | 'image'
  | 'emoji'
  | 'voice'
  | 'fake_voice'
  | 'redpacket';

export interface MsgBase {
  id: string;
  sender: 'user' | 'ai';
  type: MsgType;
  timestamp: number;
  replyTo?: { id: string; preview: string };
}

export interface TextMsg extends MsgBase { type: 'text'; text: string; }
export interface ImageMsg extends MsgBase { type: 'image'; url: string; }
export interface EmojiMsg extends MsgBase { type: 'emoji'; name: string; url: string; }

export interface VoiceMsg extends MsgBase {
  type: 'voice';
  url: string;            // 存 IndexedDB URL / 远端 URL
  duration: number;       // 秒
  transcription: string;  // 转文字（浮层展示）
}

export interface FakeVoiceMsg extends MsgBase {
  type: 'fake_voice';
  duration: number;       // 仅展示用
  hiddenText: string;     // “伪语音”的实际文本
}

export interface RedPacketMsg extends MsgBase {
  type: 'redpacket';
  amount: number;
  note?: string;
  from: 'user' | 'ai';
}

export type Message =
  | TextMsg
  | ImageMsg
  | EmojiMsg
  | VoiceMsg
  | FakeVoiceMsg
  | RedPacketMsg;

export interface Conversation {
  id: string;
  roleId: string;           // 绑定人设
  messages: Message[];
  pendingUserBuffer: string[]; // “发送”累积；“接收”一次性提交
  createdAt: number;
  updatedAt: number;
}

export interface Persona {
  id: string;
  name: string;
  prompt: string;
}

export interface UserProfile {
  id: string;
  //uid?: string;
  avatar: string;        // 统一头像（IndexedDB 内部 URL）
  personas: Persona[];
  activePersonaId?: string;
}

export interface PromptDoc {
  id: string;
  title: string;
  content: string;
}

export interface Moment {
  id: string;
  author: 'user' | 'ai';
  authorName: string;
  avatar?: string;
  content: string;
  images?: string[];
  timestamp: number;
  likedBy: string[];
  comments: Array<{
    id: string;
    author: 'user' | 'ai';
    content: string;
    timestamp: number;
    replyToCommentId?: string;
  }>;
}
