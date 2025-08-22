import { ReactNode } from 'react';

export default function Modal({
  open,
  onClose,
  children,
  title
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-semibold">{title}</div>
          <button className="text-sm text-gray-500" onClick={onClose}>关闭</button>
        </div>
        {children}
      </div>
    </div>
  );
}
