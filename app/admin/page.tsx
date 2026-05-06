'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, CheckCircle, XCircle, Trash2, Shield, Loader2, AlertCircle, Filter } from 'lucide-react';
import { getAuthToken, isAuthenticated, clearAuth } from '@/lib/auth';

interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAge: string;
  location: string;
  price: number | null;
  status: string;
  createdAt: string;
  producer: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function AdminPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/admin/programs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 403) {
        alert('אין לך הרשאות מנהלת');
        router.push('/dashboard');
        return;
      }

      if (res.status === 401) {
        clearAuth();
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch programs');
      }

      const data = await res.json();
      setPrograms(data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('שגיאה בטעינת התוכניות');
      setLoading(false);
    }
  };

  const handleApprove = async (programId: string) => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/programs', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ programId, status: 'approved' }),
      });

      if (res.ok) {
        setPrograms(programs.map(p => p.id === programId ? { ...p, status: 'approved' } : p));
      }
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (programId: string) => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/programs', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ programId, status: 'rejected' }),
      });

      if (res.ok) {
        setPrograms(programs.map(p => p.id === programId ? { ...p, status: 'rejected' } : p));
      }
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  const handleDelete = async (programId: string) => {
    if (!confirm('האם את בטוחה שברצונך למחוק תוכנית זו לצמיתות?')) return;
    
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/programs?programId=${programId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setPrograms(programs.filter(p => p.id !== programId));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const filteredPrograms = programs.filter(p => filter === 'all' || p.status === filter);

  const pendingCount = programs.filter(p => p.status === 'pending').length;
  const approvedCount = programs.filter(p => p.status === 'approved').length;
  const rejectedCount = programs.filter(p => p.status === 'rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (error) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header מכובד */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">פאנל ניהול</h1>
              <p className="text-sm text-gray-500">ממשק מנהלת</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            התנתק
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* כותרת וסטטיסטיקות */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">ניהול תוכניות</h2>
          <p className="text-gray-600">סה"כ {programs.length} תוכניות במערכת</p>
        </div>

        {/* פילטרים בגווני סגול-ורוד */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-700">סינון לפי סטטוס</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`p-4 rounded-xl font-semibold transition-all cursor-pointer ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <div className="text-2xl font-bold">{programs.length}</div>
              <div className="text-sm opacity-90">הכל</div>
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`p-4 rounded-xl font-semibold transition-all cursor-pointer ${
                filter === 'pending' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              <div className="text-2xl font-bold">{pendingCount}</div>
              <div className="text-sm opacity-90">ממתין</div>
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`p-4 rounded-xl font-semibold transition-all cursor-pointer ${
                filter === 'approved' 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
              }`}
            >
              <div className="text-2xl font-bold">{approvedCount}</div>
              <div className="text-sm opacity-90">מאושר</div>
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`p-4 rounded-xl font-semibold transition-all cursor-pointer ${
                filter === 'rejected' 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-300'
              }`}
            >
              <div className="text-2xl font-bold">{rejectedCount}</div>
              <div className="text-sm opacity-90">נדחה</div>
            </button>
          </div>
        </div>

        {/* רשימת תוכניות */}
        {filteredPrograms.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">אין תוכניות להצגה</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrograms.map(program => (
              <div key={program.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start gap-6">
                    {/* תוכן */}
                    <div className="flex-1 space-y-4">
                      {/* כותרת וסטטוס */}
                      <div className="flex items-start gap-3">
                        <h3 className="text-xl font-bold text-gray-800 flex-1">{program.title}</h3>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
                          program.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                          program.status === 'rejected' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {program.status === 'approved' ? '✓ מאושר' : 
                           program.status === 'rejected' ? '✗ נדחה' : 
                           '⏳ ממתין'}
                        </span>
                      </div>
                      
                      {/* תיאור */}
                      <p className="text-gray-600 leading-relaxed">{program.description}</p>
                      
                      {/* פרטי תוכנית */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 block mb-1">קטגוריה</span>
                            <span className="font-semibold text-gray-800">{program.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block mb-1">גיל מטרה</span>
                            <span className="font-semibold text-gray-800">{program.targetAge}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block mb-1">מיקום</span>
                            <span className="font-semibold text-gray-800">{program.location}</span>
                          </div>
                          {program.price && (
                            <div>
                              <span className="text-gray-500 block mb-1">מחיר</span>
                              <span className="font-semibold text-purple-600">₪{program.price}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* פרטי מפיקה */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">פרטי המפיקה</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="text-gray-500">שם: </span>
                            <span className="font-medium">{program.producer.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">טלפון: </span>
                            <span className="font-medium">{program.producer.phone}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">אימייל: </span>
                            <span className="font-medium">{program.producer.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* כפתורי פעולה עם cursor */}
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      {program.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(program.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-medium shadow-sm hover:shadow-md cursor-pointer"
                          title="אשר תוכנית"
                        >
                          <CheckCircle className="h-4 w-4" />
                          אשר
                        </button>
                      )}
                      {program.status !== 'rejected' && (
                        <button
                          onClick={() => handleReject(program.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all font-medium shadow-sm hover:shadow-md cursor-pointer"
                          title="דחה תוכנית"
                        >
                          <XCircle className="h-4 w-4" />
                          דחה
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(program.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-medium shadow-sm hover:shadow-md cursor-pointer"
                        title="מחק תוכנית"
                      >
                        <Trash2 className="h-4 w-4" />
                        מחק
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
