'use client';

import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DashboardProgram } from '@/types/program';

interface ProgramCardProps {
  program: DashboardProgram;
  onDelete: () => void;
}

export function ProgramCard({ program, onDelete }: ProgramCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold">{program.title}</h3>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {program.category}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>
      
      <div className="text-sm text-gray-500 space-y-1 mb-4">
        <p>גיל: {program.targetAge}</p>
        <p>מיקום: {program.location}</p>
        {program.price && <p>מחיר: ₪{program.price}</p>}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/edit/${program.id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          <Edit className="h-4 w-4" />
          ערוך
        </Link>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
          מחק
        </button>
      </div>
    </div>
  );
}
