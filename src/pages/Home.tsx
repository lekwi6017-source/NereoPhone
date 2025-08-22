import AppIcon from '@/components/AppIcon';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Uploader from '@/components/Uploader';
import { idbSet } from '@/utils/idb';

export default function Home() {
  const nav = useNavigate();
  const [wallUrl, setWallUrl] = useState<string>(() => localStorage.getItem('wallpaper') || '');

  async function onWallpaper(key: string, url: string) {
    setWallUrl(url);
    localStorage.setItem('wallpaper', url);
  }

  async function onIconUpload(key: string, url: string) {
    // 预留：可将图标映射存 IndexedDB
    await idbSet('icon-home', url);
  }

  return (
    <div
      className="min-h-full pb-16"
      style={{
        backgroundImage: wallUrl ? `url(${wallUrl})` : undefined,
        backgroundSize: 'cover'
      }}
    >
      <div className="px-4 pt-6 grid grid-cols-4 gap-6">
        <AppIcon label="微信" onClick={() => nav('/wechat')}>💬</AppIcon>
        <AppIcon label="提示词" onClick={() => nav('/prompts')}>🧩</AppIcon>
        <AppIcon label="我" onClick={() => nav('/me')}>🙋</AppIcon>
        <AppIcon label="设置" onClick={() => nav('/settings')}>⚙️</AppIcon>
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-3 flex items-center justify-center">
        <div className="px-3 py-2 rounded-full bg-white/80 backdrop-blur shadow text-xs flex items-center gap-3">
          <Uploader onDone={onWallpaper} />
          <span className="text-gray-400">·</span>
          <Uploader onDone={onIconUpload} />
        </div>
      </div>
    </div>
  );
}
