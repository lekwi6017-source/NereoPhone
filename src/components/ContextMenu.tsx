import { useEffect, useRef } from 'react';

export default function ContextMenu({
  open,
  x,
  y,
  onClose,
  onAction
}: {
  open: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onAction: (act: 'quote' | 'copy' | 'delete') => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as any)) onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white shadow rounded-lg text-sm overflow-hidden"
      style={{ top: y, left: x }}
    >
      {[
        { k: 'quote', label: '引用' },
        { k: 'copy', label: '复制' },
        { k: 'delete', label: '删除' }
      ].map((i) => (
        <button
          key={i.k}
          onClick={() => onAction(i.k as any)}
          className="block w-full text-left px-3 py-2 hover:bg-gray-50"
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}
