import { idbSet } from '@/utils/idb';

export default function Uploader({
  onDone
}: {
  onDone: (key: string, url: string) => void;
}) {
  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const key = 'img-' + Date.now() + '-' + f.name;
    const blob = f; // 简化：可在此处进行压缩
    await idbSet(key, blob);
    const url = URL.createObjectURL(blob);
    onDone(key, url);
    e.currentTarget.value = '';
  }

  return (
    <label className="inline-flex items-center gap-2 text-brand">
      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
      <span>＋相册</span>
    </label>
  );
}
