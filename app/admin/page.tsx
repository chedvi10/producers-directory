'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, CheckCircle, XCircle, Trash2, Clock } from 'lucide-react';

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
  const router = useRouter();

  useEffect(() => {
    const adminId = localStorage.getItem('producerId');
    if (!adminId) {
      router.push('/login');
      return;
    }
    fetchPrograms(adminId);
  }, []);

const fetchPrograms = async (adminId: string) => {
  try {
    console.log('Admin ID:', adminId);
    const res = await fetch(`/api/admin/programs?adminId=${adminId}`);
    console.log('Response status:', res.status);
    
    if (res.status === 403) {
      alert('אין לך הרשאות מנהלת');
      router.push('/dashboard');
      return;
    }

    const data = await res.json();
    console.log('Programs data:', data);
    setPrograms(data);
    setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleApprove = async (programId: string) => {
    const adminId = localStorage.getItem('producerId');
    await fetch('/api/admin/programs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programId, status: 'approved', adminId }),
    });
    setPrograms(programs.map(p => p.id === programId ? { ...p, status: 'approved' } : p));
  };

  const handleReject = async (programId: string) => {
    const adminId = localStorage.getItem('producerId');
    await fetch('/api/admin/programs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programId, status: 'rejected', adminId }),
    });
    setPrograms(programs.map(p => p.id === programId ? { ...p, status: 'rejected' } : p));
  };

  const handleDelete = async (programId: string) => {
    if (!confirm('האם את בטוחה שברצונך למחוק תוכנית זו לצמיתות?')) return;
    
    const adminId = localStorage.getItem('producerId');
    await fetch(`/api/admin/programs?programId=${programId}&adminId=${adminId}`, {
      method: 'DELETE',
    });
    setPrograms(programs.filter(p => p.id !== programId));
  };

  const handleLogout = () => {
    localStorage.removeItem('producerId');
    router.push('/login');
  };

  const filteredPrograms = programs.filter(p => filter === 'all' || p.status === filter);

  const pendingCount = programs.filter(p => p.status === 'pending').length;
  const approvedCount = programs.filter(p => p.status === 'approved').length;
  const rejectedCount = programs.filter(p => p.status === 'rejected').length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">🔐 פאנל ניהול - מנהלת</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:underline"
          >
            <LogOut className="h-4 w-4" />
            התנתק
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">ניהול תוכניות ({programs.length})</h2>

        {/* כפתורי סינון */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'all' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            הכל ({programs.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ⏳ ממתין לאישור ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'approved' 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ✅ מאושר ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'rejected' 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ❌ נדחה ({rejectedCount})
          </button>
        </div>

        {/* רשימת תוכניות */}
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">אין תוכניות להצגה</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrograms.map(program => (
              <div key={program.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{program.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        program.status === 'approved' ? 'bg-green-100 text-green-800' :
                        program.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {program.status === 'approved' ? '✅ מאושר' : 
                         program.status === 'rejected' ? '❌ נדחה' : 
                         '⏳ ממתין'}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{program.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <p>📂 קטגוריה: {program.category}</p>
                      <p>👥 גיל מטרה: {program.targetAge}</p>
                      <p>📍 מיקום: {program.location}</p>
                      {program.price && <p>💰 מחיר: ₪{program.price}</p>}
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-semibold text-gray-700">פרטי המפיקה:</p>
                      <p className="text-sm text-gray-600">
                        👤 {program.producer.name} | 
                        📞 {program.producer.phone} | 
                        📧 {program.producer.email}
                      </p>
                    </div>
                  </div>

                  {/* כפתורי פעולה */}
                  <div className="flex flex-col gap-2">
                    {program.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(program.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        title="אשר תוכנית"
                      >
                        <CheckCircle className="h-5 w-5" />
                        אשר
                      </button>
                    )}
                    {program.status !== 'rejected' && (
                      <button
                        onClick={() => handleReject(program.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        title="דחה תוכנית"
                      >
                        <XCircle className="h-5 w-5" />
                        דחה
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      title="מחק תוכנית"
                    >
                      <Trash2 className="h-5 w-5" />
                      מחק
                    </button>
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
