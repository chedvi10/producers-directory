'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchCheck, User, Mail, Phone, Lock, Loader2, ArrowRight, CheckCircle, Star, Megaphone, Building2 } from 'lucide-react';
import { setAuthToken, getHomeRoute } from '@/lib/auth';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // בחירת תפקיד מראש לפי פרמטר ב-URL (למשל כשמגיעים מכפתור "הצטרפי כרכזת")
  const [role, setRole] = useState<'producer' | 'coordinator'>(
    searchParams.get('role') === 'coordinator' ? 'coordinator' : 'producer'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות לא תואמות');
      return;
    }

    if (formData.password.length < 6) {
      setError('הסיסמה חייבת להיות לפחות 6 תווים');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          institution: formData.institution,
          password: formData.password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'שגיאה בהרשמה');
        setLoading(false);
        return;
      }

      // התחברות אוטומטית והפניה לאזור האישי המתאים
      setAuthToken(data.token, data.role);
      router.push(getHomeRoute(data.role));
    } catch {
      setError('שגיאה בהרשמה');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">הרשמה למדריך התוכניות</h1>
          <p className="text-gray-600">
            {role === 'producer' ? 'הצטרפי לקהילת המפיקות המובילות' : 'שמרי תוכניות, נהלי הערות ותכנני אירועים'}
          </p>
        </div>

        {/* טופס */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* בחירת סוג משתמש */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                אני נרשמת בתור *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('producer')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === 'producer'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-500 hover:border-purple-200'
                  }`}
                >
                  <Megaphone className="h-6 w-6" />
                  <span className="font-semibold">מפיקה</span>
                  <span className="text-xs text-center">מפרסמת תוכניות באלפון</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('coordinator')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === 'coordinator'
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 text-gray-500 hover:border-pink-200'
                  }`}
                >
                  <Star className="h-6 w-6" />
                  <span className="font-semibold">רכזת</span>
                  <span className="text-xs text-center">מחפשת תוכניות ומתכננת אירועים</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                שם מלא *
              </label>
              <div className="relative">
                <User className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pr-11 p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                אימייל *
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pr-11 p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                טלפון *
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full pr-11 p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  required
                />
              </div>
            </div>

            {role === 'coordinator' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  מוסד *
                </label>
                <div className="relative">
                  <Building2 className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="שם המוסד"
                    className="w-full pr-11 p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                סיסמה *
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-11 p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="לפחות 6 תווים"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                אימות סיסמה *
              </label>
              <div className="relative">
                <CheckCircle className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                  <span>נרשם...</span>
                </>
              ) : (
                <>
                  <span>הירשם</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              כבר יש לך חשבון?{' '}
              <Link href="/login" className="text-purple-600 hover:text-pink-600 font-semibold transition-colors">
                התחבר כאן
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

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
