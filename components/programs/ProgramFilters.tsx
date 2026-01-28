'use client';

import { Search } from 'lucide-react';

interface ProgramFiltersProps {
  onFilterChange: (key: string, value: string) => void;
}

export function ProgramFilters({ onFilterChange }: ProgramFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-600" />
        <input
          placeholder="חיפוש..."
          className="w-full pr-10 p-2 border rounded focus:outline-none focus:ring-2 text-gray-500 focus:ring-orange-500"
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="p-2 border rounded focus:outline-none focus:ring-2 text-gray-500 focus:ring-orange-500" onChange={(e) => onFilterChange('category', e.target.value)}>
          <option value="">כל הקטגוריות</option>
          <option value="תוכניות">תוכניות</option>
          <option value="הרצאות">הרצאות</option>
          <option value="אטרקציות">אטרקציות</option>
          <option value="אתרי נופש">אתרי נופש</option>
          <option value="מסעדות">מסעדות</option>
          <option value="מדריכות טיולים">מדריכות טיולים</option>
        </select>
        <select className="p-2 border rounded focus:outline-none focus:ring-2 text-gray-500 focus:ring-orange-500" onChange={(e) => onFilterChange('targetAge', e.target.value)}>
          <option value="">כל הגילאים</option>
          <option value="3-6">3-6</option>
          <option value="6-12">6-12 בנים</option>
          <option value="6-12">6-12 בנות</option>
          <option value="13-18">12-16</option>
          <option value="">17 ומעלה</option>
          <option value="13-18">בנים בלבד</option>
        </select>
        <select className="p-2 border rounded focus:outline-none focus:ring-2 text-gray-500 focus:ring-orange-500" onChange={(e) => onFilterChange('location', e.target.value)}>
          <option value="">כל האזורים</option>
          <option value="תל אביב">תל אביב</option>
          <option value="ירושלים">ירושלים</option>
          <option value="חיפה">צפון</option>
          <option value="דרום">דרום</option>
        </select>
        <input
          type="number"
          placeholder="מחיר מקסימלי"
          className="p-2 border rounded focus:outline-none focus:ring-2 text-gray-500 focus:ring-orange-500"
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
        />
      </div>
    </div>
  );
}
