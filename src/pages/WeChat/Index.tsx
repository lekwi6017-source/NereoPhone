import { NavLink, Outlet } from 'react-router-dom';

export default function WeChatIndex() {
  const tabs = [
    { to: '/wechat/chats', label: '聊天' },
    { to: '/wechat/forum', label: '论坛' },
    { to: '/wechat/moments', label: '朋友圈' }
  ];

  return (
    <div className="min-h-full pb-14">
      <header className="h-12 flex items-center px-4 border-b bg-white sticky top-0 z-10">
        <div className="font-semibold">微信</div>
        <nav className="ml-auto flex gap-4 text-sm">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                isActive ? 'text-brand font-semibold' : 'text-gray-500'
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
