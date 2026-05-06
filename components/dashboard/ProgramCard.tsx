'use client';

import { Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { DashboardProgram } from '@/types/program';

interface ProgramCardProps {
  program: DashboardProgram;
  onDelete: () => void;
}

export function ProgramCard({ program, onDelete }: ProgramCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-lg font-bold text-white flex-1 line-clamp-2">{program.title}</h3>
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
            {program.category}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* סטטוס */}
        <div>
          {program.status === 'approved' && (
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-emerald-200">
              <CheckCircle className="h-4 w-4" />
              מאושר
            </span>
          )}
          {program.status === 'pending' && (
            <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-amber-200">
              <Clock className="h-4 w-4" />
              ממתין לאישור
            </span>
          )}
          {program.status === 'rejected' && (
            <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-red-200">
              <XCircle className="h-4 w-4" />
              נדחה
            </span>
          )}
        </div>
        
        {/* תיאור */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{program.description}</p>
        
        {/* פרטים */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">גיל מטרה:</span>
            <span className="font-medium text-gray-800">{program.targetAge}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">מיקום:</span>
            <span className="font-medium text-gray-800">{program.location}</span>
          </div>
          {program.price && (
            <div className="flex justify-between">
              <span className="text-gray-500">מחיר:</span>
              <span className="font-semibold text-purple-600">₪{program.price}</span>
            </div>
          )}
        </div>

        {/* כפתורים */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/dashboard/edit/${program.id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-all cursor-pointer"
          >
            <Edit className="h-4 w-4" />
            ערוך
          </Link>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            מחק
          </button>
        </div>
      </div>
    </div>
  );
}
