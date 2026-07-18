'use client';

import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';

interface ToastNotificationProps {
  message: string;
  kind?: ToastKind;
  visible: boolean;
}

const TOAST_STYLES: Record<ToastKind, string> = {
  success: 'bg-emerald-50/95 border-emerald-400 text-emerald-900',
  error: 'bg-red-50/95 border-red-400 text-red-900',
  info: 'bg-sky-50/95 border-sky-400 text-sky-900',
};

function ToastIcon({ kind }: { kind: ToastKind }) {
  if (kind === 'success') return <CheckCircle2 className="h-5 w-5 text-emerald-700" />;
  if (kind === 'error') return <AlertTriangle className="h-5 w-5 text-red-700" />;
  return <Info className="h-5 w-5 text-sky-700" />;
}

export function ToastNotification({ message, kind = 'info', visible }: ToastNotificationProps) {
  if (!visible || !message) return null;

  return (
    <div className="fixed top-20 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 animate-fadeIn">
      <div className={`rounded-2xl border-2 px-5 py-4 shadow-2xl backdrop-blur-md ${TOAST_STYLES[kind]}`}>
        <div className="flex items-center justify-center gap-3 text-center">
          <ToastIcon kind={kind} />
          <p className="text-base font-bold leading-relaxed sm:text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
}
