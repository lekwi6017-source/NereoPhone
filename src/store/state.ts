import { createContext } from 'react';
import type {
  Conversation,
  Moment,
  PromptDoc,
  UserProfile
} from '@/types/models';

export interface RootState {
  uid: string;
  profile: UserProfile | null;
  conversations: Conversation[];
  prompts: PromptDoc[];
  moments: Moment[];
  activeConvId?: string;
}

export const defaultState: RootState = {
  uid: 'local-' + Math.random().toString(36).slice(2, 8),
  profile: null,
  conversations: [],
  prompts: [],
  moments: [],
  activeConvId: undefined
};

export const StoreContext = createContext<{
  state: RootState;
  setState: React.Dispatch<React.SetStateAction<RootState>>;
} | null>(null);
