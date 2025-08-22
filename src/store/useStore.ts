import { useContext, useEffect, useMemo } from 'react';
import { StoreContext } from './state';
import type {
  Conversation,
  Message,
  Persona,
  PromptDoc,
  UserProfile
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
      const [convs, prompts, profiles, moments] = await Promise.all([
        fsGetAll<Conversation>('conversations'),
        fsGetAll<PromptDoc>('prompts'),
        fsGetAll<UserProfile>('userProfiles'),
        fsGetAll<any>('moments')
      ]);

      const profile =
        profiles.find((p) => p.uid === state.uid) ??
        {
          uid: state.uid,
          avatar: '',
          personas: [],
          activePersonaId: undefined
        };

      setState((s) => ({
        ...s,
        profile,
        conversations: convs,
        prompts,
        moments
      }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 持久化（简化全量）
  async function persistAll() {
    await Promise.all([
      fsSetAll('conversations', state.conversations),
      fsSetAll('prompts', state.prompts),
      fsSetAll('userProfiles', [state.profile!]),
      fsSetAll('moments', state.moments)
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
      const profile = { ...(s.profile ?? { uid: s.uid, avatar: '', personas: [] }) };
      const i = profile.personas.findIndex((x) => x.id === p.id);
      if (i >= 0) profile.personas[i] = p;
      else profile.personas.push(p);
      return { ...s, profile };
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
    persistAll
  };
}
