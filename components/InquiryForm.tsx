'use client';

import { useState } from 'react';
import { X, Send, Loader2, CheckCircle, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { authFetch } from '@/lib/auth';

interface InquiryFormProps {
  programId: string;
  programTitle: string;
  onClose: () => void;
}

export function InquiryForm({ programId, programTitle, onClose }: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // אם הרכזת מחוברת - authFetch מוסיף את הטוקן והפנייה תשויך לחשבון שלה
      const res = await authFetch('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify({ programId, ...formData }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'שגיאה בשליחת הפנייה');
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
    } catch (err) {
      setError('שגיאה בשליחת הפנייה');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fadeIn"
      onClick={(e) => {
        // הטופס מרונדר בתוך מודל התוכנית - עוצרים את הבעבוע כדי לא לסגור גם אותו
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 flex justify-between items-start rounded-t-3xl">
          <div>
            <h2 className="text-xl font-bold">פנייה למפיקה</h2>
            <p className="text-purple-100 text-sm mt-1">בנוגע לתוכנית: {programTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <div className="p-10 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">הפנייה נשלחה בהצלחה!</h3>
            <p className="text-gray-500 mb-6">המפיקה קיבלה את הפרטים שלך ותחזור אלייך בהקדם</p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
            >
              סגירה
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-center text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">שם מלא *</label>
              <div className="relative">
                <User className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full pr-11 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">טלפון *</label>
              <div className="relative">
                <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full pr-11 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">אימייל</label>
              <div className="relative">
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full pr-11 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">הודעה *</label>
              <div className="relative">
                <MessageSquare className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="למשל: מעוניינת בתוכנית לקעמפ בתאריך... אשמח לפרטים נוספים"
                  className="w-full pr-11 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>שולח...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>שליחת פנייה</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
