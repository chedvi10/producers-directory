'use client';

import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface ProgramFiltersProps {
  onFilterChange: (key: string, value: string) => void;
}

export function ProgramFilters({ onFilterChange }: ProgramFiltersProps) {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-6 overflow-hidden">
      {/* כפתור הצגה/הסתרה */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full p-4 flex items-center justify-between hover:bg-purple-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-purple-600" />
          <span className="font-semibold text-gray-800">סינון תוכניות</span>
        </div>
        <div className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* פילטרים */}
      {showFilters && (
        <div className="p-6 space-y-5 border-t border-gray-100">
          {/* חיפוש */}
          <div className="relative">
            <Search className="absolute right-4 top-4 h-5 w-5 text-gray-400" />
            <input
              placeholder="חיפוש תוכנית, מפיקה או מילת מפתח..."
              className="w-full pr-12 pl-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all"
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>

          {/* שאר הפילטרים */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* קטגוריה */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">קטגוריה</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white transition-all"
                onChange={(e) => onFilterChange('category', e.target.value)}
              >
                <option value="">כל הקטגוריות</option>
                <option value="תוכניות">תוכניות</option>
                <option value="הרצאות">הרצאות</option>
                <option value="אטרקציות">אטרקציות</option>
                <option value="אתרי נופש">אתרי נופש</option>
                <option value="מסעדות">מסעדות</option>
                <option value="מדריכות טיולים">מדריכות טיולים</option>
              </select>
            </div>

            {/* גיל מטרה */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">גיל מטרה</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white transition-all"
                onChange={(e) => onFilterChange('targetAge', e.target.value)}
              >
                <option value="">כל הגילאים</option>
                <option value="3-6">3-6</option>
                <option value="6-12">6-12 בנים</option>
                <option value="6-12">6-12 בנות</option>
                <option value="13-18">12-16</option>
                <option value="">17 ומעלה</option>
                <option value="13-18">בנים בלבד</option>
              </select>
            </div>

            {/* מיקום */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">מיקום</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white transition-all"
                onChange={(e) => onFilterChange('location', e.target.value)}
              >
                <option value="">כל האזורים</option>
                <option value="תל אביב">תל אביב</option>
                <option value="ירושלים">ירושלים</option>
                <option value="חיפה">צפון</option>
                <option value="דרום">דרום</option>
              </select>
            </div>

            {/* מחיר */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">מחיר מקסימלי</label>
              <input
                type="number"
                placeholder="₪ 0"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400 transition-all"
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
