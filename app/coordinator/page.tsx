'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SavedProgramCard } from '@/components/coordinator/SavedProgramCard';
import { InquiryForm } from '@/components/InquiryForm';
import { ToastNotification } from '@/components/ui/ToastNotification';
import { SavedProgram } from '@/types/program';
import { LogOut, Search, SearchCheck } from 'lucide-react';
import { authFetch, getHomeRoute, getServerUserRole, logoutAndRedirect, requireAuthOrRedirect } from '@/lib/auth';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';

export default function CoordinatorPage() {
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>([]);
  const [coordinatorName, setCoordinatorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inquiryTarget, setInquiryTarget] = useState<SavedProgram | null>(null);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'info' } | null>(null);
  const router = useRouter();

  const showToast = (message: string, kind: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, kind });
  };

  const fetchData = useCallback(async () => {
    try {
      const [savedRes, profileRes] = await Promise.all([
        authFetch('/api/coordinator/saved'),
        authFetch('/api/coordinator/profile'),
      ]);

      if (!savedRes.ok) {
        if (savedRes.status === 401 || savedRes.status === 403) {
          logoutAndRedirect(router);
          return;
        }
        throw new Error('Failed to fetch data');
      }

      const data = await savedRes.json();
      setSavedPrograms(data.savedPrograms || []);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setCoordinatorName(profileData?.coordinator?.name || '');
      }

      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('שגיאה בטעינת הנתונים');
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!requireAuthOrRedirect(router)) return;

    const bootstrap = async () => {
      const role = await getServerUserRole();
      if (!role) {
        logoutAndRedirect(router);
        return;
      }

      if (role !== 'coordinator') {
        router.replace(getHomeRoute(role));
        return;
      }

      fetchData();
    };

    void bootstrap();
  }, [fetchData, router]);

  const handleLogout = () => {
    logoutAndRedirect(router);
  };

  // מחזיר הצלחה/כשלון כדי שהכרטיס יציג משוב אמיתי ולא "נשמר" על עדכון שנכשל
  const handleUpdate = async (savedId: string, data: { note?: string; trackStatus?: string }): Promise<boolean> => {
    try {
      const res = await authFetch('/api/coordinator/saved', {
        method: 'PUT',
        body: JSON.stringify({ savedId, ...data }),
      });

      if (!res.ok) return false;

      const { savedProgram } = await res.json();
      setSavedPrograms((prev) =>
        prev.map((s) => (s.id === savedId ? { ...s, note: savedProgram.note, trackStatus: savedProgram.trackStatus } : s))
      );
      return true;
    } catch (err) {
      console.error('Update error:', err);
      return false;
    }
  };

  const handleRemove = async (savedId: string) => {
    if (!confirm('להסיר את התוכנית מהרשימה שלך?')) return;

    try {
      const res = await authFetch(`/api/coordinator/saved?savedId=${savedId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSavedPrograms((prev) => prev.filter((s) => s.id !== savedId));
        showToast('התוכנית הוסרה מהאזור האישי', 'info');
      } else {
        showToast('לא הצלחנו להסיר את התוכנית, נסי שוב', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('לא הצלחנו להסיר את התוכנית, נסי שוב', 'error');
    }
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
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
              href="/programs"
              className="flex items-center gap-2 text-purple-600 hover:text-pink-600 font-medium transition-colors"
            >
              <Search className="h-5 w-5" />
              חיפוש תוכניות
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
        <h2 className="text-2xl font-bold text-gray-800">
          שלום {coordinatorName ? `${coordinatorName},` : ','}
          <span className="block">ברוך/ה הבא/ה לאזור האישי שלך</span>
        </h2>

        {/* כותרת */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50/40 to-pink-50/40 p-6 shadow-sm">
          <div className="pointer-events-none absolute -top-10 -left-10 h-36 w-36 rounded-full bg-pink-100/60 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-10 h-40 w-40 rounded-full bg-purple-100/70 blur-2xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">התוכניות ששמרתי</h2>
              <p className="text-gray-600 text-sm mt-1">
                כאן אפשר לנהל הערות ולעקוב אחרי סטטוס
              </p>
            </div>

            <div className="min-w-[140px] rounded-3xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 px-5 py-4 text-center shadow-[0_10px_30px_rgba(168,85,247,0.12)] ring-1 ring-white/70">
              <p className="text-sm font-medium text-gray-500">תוכניות שמורות</p>
              <p className="mt-2 text-4xl font-bold leading-none text-gray-800">{savedPrograms.length}</p>
            </div>
          </div>
        </div>

        {/* תוכניות שמורות */}
        {savedPrograms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-2">עדיין לא שמרת תוכניות</h3>
              <p className="text-gray-500 mb-6">גלשי באלפון התוכניות ולחצי על שמירה כדי לשמור תוכניות שמעניינות אותך</p>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-all cursor-pointer"
              >
                <Search className="h-5 w-5" />
                לאלפון התוכניות
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedPrograms.map((saved) => (
              <SavedProgramCard
                key={saved.id}
                saved={saved}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
                onInquiry={setInquiryTarget}
                onToast={showToast}
              />
            ))}
          </div>
        )}
      </div>

      {/* טופס פנייה */}
      {inquiryTarget && (
        <InquiryForm
          programId={inquiryTarget.programId}
          programTitle={inquiryTarget.program.title}
          onClose={() => setInquiryTarget(null)}
        />
      )}

      <ToastNotification
        visible={!!toast}
        message={toast?.message || ''}
        kind={toast?.kind || 'info'}
      />
    </div>
  );
}
