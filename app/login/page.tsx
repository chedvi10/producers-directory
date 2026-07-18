'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchCheck, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { setAuthToken, getHomeRoute } from '@/lib/auth';

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

      setAuthToken(data.token, data.producer?.role);

      // הפניה לאזור האישי המתאים לפי סוג המשתמש
      router.push(getHomeRoute(data.producer?.role));
    } catch {
      setError('שגיאה בהתחברות');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* כותרת */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <SearchCheck className="h-8 w-8 text-purple-600 group-hover:rotate-12 transition-transform" />
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              מדריך תוכניות
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">התחברות מפיקות ורכזות</h1>
        </div>

        {/* טופס */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-11 p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-11 p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>מתחבר...</span>
                </>
              ) : (
                <>
                  <span>התחבר</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              עדיין אין לך חשבון?{' '}
              <Link href="/register" className="text-purple-600 hover:text-pink-600 font-semibold transition-colors">
                הירשמי כאן
              </Link>
            </p>
            <Link href="/" className="inline-flex items-center gap-1 text-purple-600 hover:text-pink-600 text-sm font-medium transition-colors">
              <ArrowRight className="h-4 w-4" />
              <span>חזרה לעמוד הבית</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
