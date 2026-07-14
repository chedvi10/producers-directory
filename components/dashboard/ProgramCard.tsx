'use client';

import { Edit, Trash2, Clock, CheckCircle, XCircle, Eye, Inbox, Star } from 'lucide-react';
import Link from 'next/link';
import { DashboardProgram, ProgramStats } from '@/types/program';

interface ProgramCardProps {
  program: DashboardProgram;
  stats?: ProgramStats;
  onDelete: () => void;
}

export function ProgramCard({ program, stats, onDelete }: ProgramCardProps) {
  const audienceLabel =
    program.audience === 'MEN' ? 'בנים' : program.audience === 'WOMEN' ? 'בנות' : 'בנים ובנות';

  const audienceClasses =
    program.audience === 'MEN'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : program.audience === 'WOMEN'
        ? 'bg-pink-50 text-pink-700 border-pink-200'
        : 'bg-violet-50 text-violet-700 border-violet-200';

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
        <div className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
              <p className="text-xs font-medium text-gray-500">טווח גילאים</p>
              <p className="font-semibold text-gray-800" dir="ltr">{Math.min(program.minAge, program.maxAge)} - {Math.max(program.minAge, program.maxAge)}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
              <p className="text-xs font-medium text-gray-500">למי מיועדת התוכנית</p>
              <span className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold ${audienceClasses}`}>
                {audienceLabel}
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
              <p className="text-xs font-medium text-gray-500">מיקום</p>
              <p className="font-semibold text-gray-800 truncate">{program.location}</p>
            </div>
          </div>

          {program.price && (
            <div className="flex justify-between mt-2">
              <span className="text-gray-500">מחיר:</span>
              <span className="font-semibold text-purple-600">₪{program.price}</span>
            </div>
          )}
        </div>

        {/* סטטיסטיקות */}
        {stats && (
          <div className="flex items-center justify-around bg-purple-50/60 rounded-lg p-2.5 border border-purple-100 text-sm">
            <span className="flex items-center gap-1.5 text-gray-600" title="צפיות">
              <Eye className="h-4 w-4 text-purple-500" />
              {stats.views}
            </span>
            <span className="flex items-center gap-1.5 text-gray-600" title="פניות">
              <Inbox className="h-4 w-4 text-pink-500" />
              {stats.inquiriesCount}
            </span>
            <span className="flex items-center gap-1.5 text-gray-600" title="שמירות על ידי רכזות">
              <Star className="h-4 w-4 text-amber-500" />
              {stats.savedCount}
            </span>
          </div>
        )}

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
