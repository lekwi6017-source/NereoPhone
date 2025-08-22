import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useEffect } from 'react';

export default function App() {
  const loc = useLocation();
  const nav = useNavigate();

  // 初始跳转到 /wechat
  useEffect(() => {
    if (loc.pathname === '/') nav('/wechat');
  }, []);

  return (
    <div className="min-h-dvh bg-neutral-100">
      <Outlet />
      <NavBar />
    </div>
  );
}
