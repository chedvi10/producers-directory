'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorScreenProps {
  error: string;
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
      <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-6 text-lg font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
        >
          נסה שוב
        </button>
      </div>
    </div>
  );
}
