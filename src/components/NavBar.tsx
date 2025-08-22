import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/wechat', label: '微信', icon: '💬' },
  { to: '/prompts', label: '提示词', icon: '🧩' },
  { to: '/me', label: '我', icon: '🙋' },
  { to: '/settings', label: '设置', icon: '⚙️' }
];

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 h-14 bg-white border-t flex items-stretch justify-around">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            'flex-1 flex flex-col items-center justify-center text-xs ' +
            (isActive ? 'text-brand font-semibold' : 'text-gray-500')
          }
        >
          <div className="text-xl">{t.icon}</div>
          <div>{t.label}</div>
        </NavLink>
      ))}
    </nav>
  );
}
