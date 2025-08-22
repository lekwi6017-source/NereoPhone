import { idbSet } from '@/utils/idb';
import { fsSetAll } from '@/api/firebase';

export async function importAll(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);

  // 写回 Firestore 简化：全量覆盖
  await Promise.all([
    fsSetAll('conversations', data.conversations || []),
    fsSetAll('prompts', data.prompts || []),
    fsSetAll('userProfiles', data.userProfiles || []),
    fsSetAll('moments', data.moments || [])
  ]);

  // 文件回写
  const files: Record<string, string> = data.files || {};
  for (const [k, base64] of Object.entries(files)) {
    const res = await fetch(base64);
    const blob = await res.blob();
    await idbSet(k, blob);
  }
}
