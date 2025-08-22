import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Conversation, PromptDoc, UserProfile, Moment } from '@/types/models';

export interface RootState {
  uid: string;
  profile: UserProfile | null;      // 允许为空，页面再判空
  conversations: Conversation[];
  prompts: PromptDoc[];
  moments: Moment[];
  activeConvId?: string;
}

// 给本地一个稳定 uid，后续初始化 profile 时可复用
export const defaultUid = 'local-' + Math.random().toString(36).slice(2, 8);

export const defaultState: RootState = {
  uid: defaultUid,
  profile: null,
  conversations: [],
  prompts: [],
  moments: [] as Moment[],
  activeConvId: undefined,
};

export const StoreContext = createContext<{
  state: RootState;
  setState: Dispatch<SetStateAction<RootState>>;
} | null>(null);
