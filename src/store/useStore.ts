import { useContext, useEffect, useMemo } from 'react';
import { StoreContext } from './state';
import type {
  Conversation,
  Message,
  Persona,
  PromptDoc,
  UserProfile,
} from '@/types/models';
import { ts } from '@/utils/time';
import { ensureFirebase, fsGetAll, fsSetAll } from '@/api/firebase';

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('StoreContext missing');
  const { state, setState } = ctx;

  // 首次加载：Firebase → 内存；无 Firebase 则 localStorage
  useEffect(() => {
    (async () => {
      await ensureFirebase();

      const [convs, prompts, profilesRaw, moments] = await Promise.all([
        fsGetAll<Conversation>('conversations'),
        fsGetAll<PromptDoc>('prompts'),
        fsGetAll<any>('userProfiles'), // 旧数据可能含 uid
        fsGetAll<any>('moments'),
      ]);

      // 规范化旧/新 profile：给出 id 与 uid（互为兜底）
      const normalize = (p: any): UserProfile => {
        const id = p?.id ?? p?.uid ?? state.uid;
        const uid = p?.uid ?? p?.id ?? state.uid;
        return {
          id,
          uid,
          avatar: p?.avatar ?? '',
          personas: Array.isArray(p?.personas) ? p.personas : [],
          activePersonaId: p?.activePersonaId,
        };
      };

      const profiles = profilesRaw.map(normalize);

      const profile: UserProfile =
        profiles.find((p) => p.id === state.uid) ?? {
          id: state.uid,
          uid: state.uid,
          avatar: '',
          personas: [],
          activePersonaId: undefined,
        };

      setState((s) => ({
        ...s,
        profile,
        conversations: convs,
        prompts,
        moments,
      }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 持久化（简化全量）
  async function persistAll() {
    const profiles = state.profile ? [state.profile] : [];
    await Promise.all([
      fsSetAll('conversations', state.conversations),
      fsSetAll('prompts', state.prompts),
      fsSetAll('userProfiles', profiles),
      fsSetAll('moments', state.moments),
    ]);
  }

  function upsertConversation(upd: Conversation) {
    setState((s) => {
      const i = s.conversations.findIndex((c) => c.id === upd.id);
      const arr = [...s.conversations];
      if (i >= 0) arr[i] = upd;
      else arr.unshift(upd);
      return { ...s, conversations: arr, activeConvId: upd.id };
    });
  }

  function pushMessage(convId: string, msg: Message) {
    setState((s) => {
      const i = s.conversations.findIndex((c) => c.id === convId);
      if (i < 0) return s;
      const conv = { ...s.conversations[i] };
      conv.messages = [...conv.messages, msg];
      conv.updatedAt = ts();
      const arr = [...s.conversations];
      arr[i] = conv;
      return { ...s, conversations: arr };
    });
  }

  function setPersona(p: Persona) {
    setState((s) => {
      if (!s.profile) return s; // 二次保护
      const cur = s.profile;
      const idx = cur.personas.findIndex((x) => x.id === p.id);
      const personas = [...cur.personas];
      if (idx >= 0) personas[idx] = p;
      else personas.push(p);
      return { ...s, profile: { ...cur, personas } }; // 保留 id/uid/avatar
    });
  }

  const activeConv = useMemo(
    () => state.conversations.find((c) => c.id === state.activeConvId),
    [state.conversations, state.activeConvId]
  );

  return {
    state,
    setState,
    activeConv,
    upsertConversation,
    pushMessage,
    persistAll,
    setPersona,
  };
}
