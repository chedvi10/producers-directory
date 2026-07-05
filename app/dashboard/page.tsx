'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgramCard } from '@/components/dashboard/ProgramCard';
import { SubscriptionStatus } from '@/components/dashboard/SubscriptionStatus';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { Producer, DashboardProgram, ProgramStats } from '@/types/program';
import { LogOut, Plus, SearchCheck, Inbox } from 'lucide-react';
import { isAuthenticated, authFetch, clearAuth } from '@/lib/auth';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';

export default function DashboardPage() {
  const [programs, setPrograms] = useState<DashboardProgram[]>([]);
  const [stats, setStats] = useState<ProgramStats[]>([]);
  const [producer, setProducer] = useState<Producer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await authFetch('/api/dashboard');

      if (!res.ok) {
        if (res.status === 401) {
          clearAuth();
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();
      setProducer(data.producer);
      setPrograms(data.programs || []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('שגיאה בטעינת הנתונים');
      setPrograms([]);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const handleDelete = async (programId: string) => {
    if (!confirm('האם את בטוחה שברצונך למחוק תוכנית זו?')) return;

    try {
      const res = await authFetch(`/api/dashboard?programId=${programId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPrograms(programs.filter((p) => p.id !== programId));
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header נקי */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <SearchCheck className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">האזור האישי שלי</h1>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard/inquiries"
              className="flex items-center gap-2 text-purple-600 hover:text-pink-600 font-medium transition-colors"
            >
              <Inbox className="h-5 w-5" />
              הפניות שלי
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              התנתק
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* כרטיס ברכה פשוט */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">שלום, {producer?.name || 'משתמש'}</h2>
              <p className="text-gray-500 text-sm mt-1">ברוכה הבאה לאזור האישי שלך</p>
            </div>
          </div>
          <SubscriptionStatus subscription={producer?.subscription} />
        </div>

        {/* סטטיסטיקות */}
        <StatsOverview onStatsLoaded={setStats} />

        {/* כותרת + כפתור */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">התוכניות שלי</h2>
            <p className="text-gray-500 text-sm mt-1">סה"כ {programs?.length || 0} תוכניות</p>
          </div>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            הוסף תוכנית
          </Link>
        </div>

        {/* תוכניות */}
        {programs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">עדיין אין לך תוכניות</h3>
              <p className="text-gray-500 mb-6">התחילי עכשיו והוסיפי את התוכנית הראשונה שלך</p>
              <Link
                href="/dashboard/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-all cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                צרי תוכנית ראשונה
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                stats={stats.find((s) => s.programId === program.id)}
                onDelete={() => handleDelete(program.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
