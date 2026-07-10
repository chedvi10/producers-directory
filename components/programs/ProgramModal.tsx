'use client';

import { useState, useEffect } from 'react';
import { X, Users, MapPin, Clock, DollarSign, Phone, Image as ImageIcon, Video as VideoIcon, Sparkles, Mail, Star, Send } from 'lucide-react';
import { Program } from '@/types/program';
import { InquiryForm } from '@/components/InquiryForm';
import { authFetch, getUserRole } from '@/lib/auth';

interface ProgramModalProps {
  program: Program;
  onClose: () => void;
}

export function ProgramModal({ program, onClose }: ProgramModalProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const isCoordinator = getUserRole() === 'coordinator';

  useEffect(() => {
    // ספירת צפייה בתוכנית (לסטטיסטיקות המפיקה).
    // sessionStorage מונע ספירה כפולה: פתיחות חוזרות באותו ביקור לא נספרות,
    // וגם ההרצה הכפולה של useEffect ב-StrictMode בפיתוח לא סופרת פעמיים
    const viewedKey = `viewed:${program.id}`;
    if (!sessionStorage.getItem(viewedKey)) {
      sessionStorage.setItem(viewedKey, '1');
      fetch(`/api/programs/${program.id}/view`, { method: 'POST' }).catch(() => {});
    }

    // בדיקה אם התוכנית כבר שמורה אצל הרכזת
    if (isCoordinator) {
      authFetch(`/api/coordinator/saved?programId=${program.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setIsSaved(data.saved))
        .catch(() => {});
    }
  }, [program.id]);

  const handleToggleSave = async () => {
    try {
      const res = await authFetch('/api/coordinator/saved', {
        method: 'POST',
        body: JSON.stringify({ programId: program.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
      }
    } catch {
      // שמירה נכשלה - לא מפילים את המודל
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-start rounded-t-3xl z-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{program.title}</h2>
            <p className="text-purple-100 flex items-center gap-2">
              {program.producer?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isCoordinator && (
              <button
                onClick={handleToggleSave}
                className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title={isSaved ? 'הסרה מהתוכניות השמורות' : 'שמירה לאזור האישי'}
              >
                <Star className={`h-6 w-6 ${isSaved ? 'fill-yellow-300 text-yellow-300' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="סגירה"
              className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* תג קטגוריה */}
          <div className="flex justify-center">
            <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-2 rounded-full font-semibold text-sm">
              {program.category}
            </span>
          </div>

          {/* מיועד ל */}
          <div className="flex justify-center">
            <span className="inline-block bg-gray-100 text-gray-800 px-4 py-1 rounded-full font-medium text-sm">
              {program.audience === 'MEN' ? 'מיועד: גברים' : program.audience === 'WOMEN' ? 'מיועד: נשים' : 'מיועד: גם גברים וגם נשים'}
            </span>
          </div>

          {/* תמונות */}
          {program.images && program.images.length > 0 && (
            <div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-800">
                <ImageIcon className="h-6 w-6 text-purple-600" />
               פרסומת
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {program.images.map((url, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={url}
                      alt={`${program.title} - תמונה ${index + 1}`}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* וידאו */}
          {program.videos && program.videos.length > 0 && (
            <div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-800">
                <VideoIcon className="h-6 w-6 text-pink-600" />
                סרטוני הדגמה
              </h3>
              <div className="space-y-4">
                {program.videos.map((url, index) => (
                  <video
                    key={index}
                    src={url}
                    controls
                    className="w-full rounded-2xl shadow-lg"
                  >
                    הדפדפן שלך לא תומך בהצגת וידאו.
                  </video>
                ))}
              </div>
            </div>
          )}

          {/* תיאור */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-3 text-gray-800">תיאור התוכנית</h3>
            <p className="text-gray-700 leading-relaxed">{program.description}</p>
          </div>

          {/* פרטים */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-purple-100 rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">טווח גילאים</p>
                  <p className="font-bold text-gray-800 text-lg">{program.minAge} - {program.maxAge}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-pink-100 rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">מיקום</p>
                  <p className="font-bold text-gray-800 text-lg">{program.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-purple-100 rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">משך התוכנית</p>
                  <p className="font-bold text-gray-800 text-lg">{program.duration}</p>
                </div>
              </div>
            </div>

            {program.price && (
              <div className="bg-white border-2 border-pink-100 rounded-2xl p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-3 rounded-xl">
                    <DollarSign className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">מחיר</p>
                    <p className="font-bold text-gray-800 text-lg">₪{program.price}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* יצירת קשר */}
          <div className="bg-gradient-to-r from-purple-700 to-pink-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Phone className="h-6 w-6" />
                  יצירת קשר
                </h3>
               
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                <span className="block h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
                {program.producer?.name}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3 rounded-3xl bg-white/10 border border-white/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/20 p-3">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80">טלפון</p>
                    <p className="font-semibold text-white text-lg">{(program.phone && program.phone.trim() !== '') ? program.phone : program.producer?.phone}</p>
                  </div>
                </div>
              </div>

              {((program.email && program.email.trim() !== '') || program.producer?.email) ? (
                <div className="flex flex-col gap-3 rounded-3xl bg-white/10 border border-white/20 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/20 p-3">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-white/80">אימייל</p>
                      <p className="font-semibold text-white text-lg break-all">{(program.email && program.email.trim() !== '') ? program.email : program.producer?.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 rounded-3xl bg-white/10 border border-white/20 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/20 p-3">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-white/80">אימייל</p>
                      <p className="font-semibold text-white text-lg">לא זמין</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white/70">
                    אין אימייל מוגדר לתוכנית זו
                  </span>
                </div>
              )}
            </div>

            {/* שליחת פנייה דרך האתר */}
            <button
              onClick={() => setShowInquiry(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-purple-700 py-3.5 rounded-2xl font-bold hover:bg-purple-50 transition-all cursor-pointer"
            >
              <Send className="h-5 w-5" />
              שליחת פנייה למפיקה דרך האתר
            </button>
          </div>
        </div>
      </div>

      {/* טופס פנייה */}
      {showInquiry && (
        <InquiryForm
          programId={program.id}
          programTitle={program.title}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </div>
  );
}
