'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProgramFilters } from '@/components/programs/ProgramFilters';
import { ProgramModal } from '@/components/programs/ProgramModal';
import { Program } from '@/types/program';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(filters);
    fetch(`/api/programs?${params}`)
      .then(r => r.json())
      .then(data => { setPrograms(data); setLoading(false); });
  }, [filters]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => value ? { ...prev, [key]: value } : { ...prev, [key]: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600">
            מדריך תוכניות
          </Link>
          <Link
            href="/login"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            כניסה למפיקות
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-600 text-center">מדריך תוכניות</h1>
        
        <ProgramFilters onFilterChange={updateFilter} />

        {loading ? (
          <div className="text-center py-12 text-gray-500">טוען...</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                  index !== programs.length - 1 ? 'border-b' : ''
                }`}
                onClick={() => setSelected(program)}//selectedPage
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-500">
                    {program.title}
                  </h3>
                  <span className="text-sm text-gray-500">{program.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {programs.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">לא נמצאו תוכניות</div>
        )}

        {selected && <ProgramModal program={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}