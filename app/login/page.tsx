'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'שגיאה בהתחברות');
        setLoading(false);
        return;
      }

      localStorage.setItem('producerId', data.producerId);
      router.push('/dashboard');
    } catch (err) {
      setError('שגיאה בהתחברות');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-600 mb-6">התחברות מפיקות</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2">
    אימייל
  </label>
  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
    required
  />
</div>

<div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-500 mb-2">
    סיסמה
  </label>
  <input
    id="password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
    required
  />
</div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
<div className="mt-6 text-center">
  <p className="text-sm text-gray-600 mb-2">
    עדיין אין לך חשבון?{' '}
    <Link href="/register" className="text-orange-500 hover:underline font-semibold">
      הירשמי כאן
    </Link>
  </p>
  <Link href="/" className="text-orange-500 hover:underline">
    חזרה לעמוד הבית
  </Link>
</div>
      </div>
    </div>
  );
}
