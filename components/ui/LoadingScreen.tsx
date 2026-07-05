'use client';

import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">טוען...</p>
      </div>
    </div>
  );
}
