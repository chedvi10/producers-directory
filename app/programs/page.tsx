'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchCheck, Search, Loader2 } from 'lucide-react';
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
      .then(data => { setPrograms(Array.isArray(data) ? data : []); setLoading(false); });
  }, [filters]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => value ? { ...prev, [key]: value } : { ...prev, [key]: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <SearchCheck className="h-6 w-6 text-purple-600 group-hover:rotate-12 transition-transform" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              מדריך תוכניות
            </h1>
          </Link>
          <Link
            href="/login"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
          >
            כניסה למפיקות
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* כותרת */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            אלפון התוכניות
          </h1>
          <p className="text-gray-600 text-lg">מצאי את התוכנית המושלמת לאירוע שלך</p>
        </div>
        
        {/* פילטרים */}
        <ProgramFilters onFilterChange={updateFilter} />

        {/* תוצאות */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-500">טוען תוכניות...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-6">
            <div className="bg-white rounded-xl shadow p-5 max-w-sm mx-auto">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-700 mb-1">לא נמצאו תוכניות</h3>
              <p className="text-gray-500 text-xs">נסי לשנות את הפילטרים</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className={`p-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-300 group ${
                  index !== programs.length - 1 ? 'border-b border-gray-100' : ''
                }`}
                onClick={() => setSelected(program)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-2">{program.description}</p>
                    <p className="text-sm text-gray-500">מפיקה: {program.producer?.name}</p>
                  </div>
                  <div className="mr-4">
                    <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm px-4 py-1.5 rounded-full font-medium">
                      {program.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && <ProgramModal program={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}
