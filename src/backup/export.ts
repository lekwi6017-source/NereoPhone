import { idbKeys, idbGet } from '@/utils/idb';
import { fsGetAll } from '@/api/firebase';

export async function exportAll() {
  // Firestore 集合
  const [conversations, prompts, userProfiles, moments] = await Promise.all([
    fsGetAll<any>('conversations'),
    fsGetAll<any>('prompts'),
    fsGetAll<any>('userProfiles'),
    fsGetAll<any>('moments')
  ]);

  // IndexedDB 文件 → base64
  const files: Record<string, string> = {};
  const keys = await idbKeys();
  for (const k of keys) {
    const blob = (await idbGet<Blob>(k))!;
    const base64 = await new Promise<string>((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.readAsDataURL(blob);
    });
    files[k] = base64;
  }

  const payload = { conversations, prompts, userProfiles, moments, files };
  const str = JSON.stringify(payload, null, 2);
  const url = URL.createObjectURL(new Blob([str], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `little-phone-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
