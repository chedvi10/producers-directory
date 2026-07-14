'use client';

import { useEffect, useState } from 'react';
import { Trash2, Phone, MapPin, StickyNote, Send, Check, AlertCircle } from 'lucide-react';
import { SavedProgram } from '@/types/program';
import { TRACK_STATUSES } from '@/lib/constants';

// צבעי התצוגה לכל סטטוס - הערכים והתוויות מגיעים מ-lib/constants
const STATUS_COLORS: Record<string, string> = {
  saved: 'bg-gray-100 text-gray-700 border-gray-300',
  contacted: 'bg-amber-50 text-amber-700 border-amber-300',
  closed: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  irrelevant: 'bg-red-50 text-red-600 border-red-300',
};

interface SavedProgramCardProps {
  saved: SavedProgram;
  onUpdate: (savedId: string, data: { note?: string; trackStatus?: string }) => Promise<boolean>;
  onRemove: (savedId: string) => void;
  onInquiry: (saved: SavedProgram) => void;
}

export function SavedProgramCard({ saved, onUpdate, onRemove, onInquiry }: SavedProgramCardProps) {
  const [note, setNote] = useState(saved.note || '');
  const [noteStatus, setNoteStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [trackStatus, setTrackStatus] = useState(saved.trackStatus);
  const [trackStatusSaving, setTrackStatusSaving] = useState(false);
  const [trackStatusError, setTrackStatusError] = useState(false);

  const program = saved.program;

  useEffect(() => {
    setTrackStatus(saved.trackStatus);
  }, [saved.trackStatus]);

  const handleSaveNote = async () => {
    setNoteStatus('saving');
    const ok = await onUpdate(saved.id, { note });
    setNoteStatus(ok ? 'saved' : 'error');
    if (ok) {
      setTimeout(() => setNoteStatus('idle'), 2000);
    }
  };

  const handleTrackStatusChange = async (nextStatus: string) => {
    if (nextStatus === trackStatus || trackStatusSaving) return;

    const prevStatus = trackStatus;
    setTrackStatusError(false);
    setTrackStatus(nextStatus);
    setTrackStatusSaving(true);

    const ok = await onUpdate(saved.id, { trackStatus: nextStatus });

    if (!ok) {
      setTrackStatus(prevStatus);
      setTrackStatusError(true);
    }

    setTrackStatusSaving(false);
  };

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
        {/* סטטוס מעקב */}
        <div className="flex flex-wrap gap-2">
          {TRACK_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => handleTrackStatusChange(s.value)}
              disabled={trackStatusSaving}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all cursor-pointer ${
                trackStatus === s.value ? STATUS_COLORS[s.value] : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {trackStatusError && (
          <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
            <AlertCircle className="h-3.5 w-3.5" /> עדכון סטטוס נכשל, נסי שוב
          </span>
        )}

        {/* פרטי התוכנית */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> מיקום:</span>
            <span className="font-medium text-gray-800">{program.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> טלפון:</span>
            <span className="font-medium text-gray-800" dir="ltr">
              {(program.phone && program.phone.trim() !== '') ? program.phone : program.producer?.phone}
            </span>
          </div>
          {program.price != null && (
            <div className="flex justify-between">
              <span className="text-gray-500">מחיר:</span>
              <span className="font-semibold text-purple-600">
                {program.price === 0 ? 'ללא עלות' : `₪${program.price}`}
              </span>
            </div>
          )}
        </div>

        {/* הערה אישית */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <StickyNote className="h-4 w-4 text-amber-500" />
            הערה אישית
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="למשל: דיברתי איתה, פנויה רק בחנוכה..."
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 resize-none"
          />
          {note !== (saved.note || '') && (
            <button
              onClick={handleSaveNote}
              disabled={noteStatus === 'saving'}
              className="mt-1 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {noteStatus === 'saving' ? 'שומר...' : 'שמור הערה'}
            </button>
          )}
          {noteStatus === 'saved' && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <Check className="h-3.5 w-3.5" /> ההערה נשמרה
            </span>
          )}
          {noteStatus === 'error' && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-red-600 font-medium">
              <AlertCircle className="h-3.5 w-3.5" /> השמירה נכשלה - נסי שוב
            </span>
          )}
        </div>

        {/* כפתורים */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onInquiry(saved)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg font-medium hover:shadow-md transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
            פנייה למפיקה
          </button>
          <button
            onClick={() => onRemove(saved.id)}
            className="flex items-center justify-center gap-2 bg-white text-red-500 border border-red-200 px-4 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-all cursor-pointer"
            title="הסרה מהרשימה"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
