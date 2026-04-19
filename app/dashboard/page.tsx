'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgramCard } from '@/components/dashboard/ProgramCard';
import { SubscriptionStatus } from '@/components/dashboard/SubscriptionStatus';
import { Producer, DashboardProgram } from '@/types/program';
import { LogOut, Plus } from 'lucide-react';

export default function DashboardPage() {
  const [programs, setPrograms] = useState<DashboardProgram[]>([]);
  const [producer, setProducer] = useState<Producer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {//לבדוק שהוא תקין.
    const producerId = localStorage.getItem('producerId');
    if (!producerId) {
      router.push('/login');
      return;
    }
    fetchData(producerId);
  }, []);

  const fetchData = async (producerId: string) => {
    try {
      const res = await fetch(`/api/dashboard?producerId=${producerId}`);
      const data = await res.json();
      setProducer(data.producer);
      setPrograms(data.programs);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('producerId');
    router.push('/login');
  };

  const handleDelete = async (programId: string) => {
    if (!confirm('האם את בטוחה שברצונך למחוק תוכנית זו?')) return;

    const producerId = localStorage.getItem('producerId');
    await fetch(`/api/dashboard?programId=${programId}&producerId=${producerId}`, {
      method: 'DELETE',
    });

    setPrograms(programs.filter((p) => p.id !== programId));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">הדשבורד שלי</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:underline"
          >
            <LogOut className="h-4 w-4" />
            התנתק
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">שלום, {producer?.name}!</h2>
          <SubscriptionStatus subscription={producer?.subscription} />
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">התוכניות שלי ({programs.length})</h2>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            <Plus className="h-5 w-5" />
            הוסף תוכנית חדשה
          </Link>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">עדיין אין לך תוכניות</p>
            <Link
              href="/dashboard/new"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              צרי את התוכנית הראשונה שלך
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onDelete={() => handleDelete(program.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
