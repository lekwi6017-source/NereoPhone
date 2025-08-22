import { ReactNode } from 'react';

export default function AppIcon({
  label,
  onClick,
  children
}: {
  label: string;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2"
    >
      <div className="w-16 h-16 rounded-2xl bg-white shadow flex items-center justify-center text-2xl">
        {children ?? '📱'}
      </div>
      <div className="text-xs">{label}</div>
    </button>
  );
}
