'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Inquiry } from '@/types/program';
import {
  ArrowRight, Inbox, Phone, Mail, User,
  CircleDot, Eye, CheckCircle, SearchCheck, LogOut, Building2,
} from 'lucide-react';
import { authFetch, logoutAndRedirect, requireAuthOrRedirect } from '@/lib/auth';
import { INQUIRY_STATUSES } from '@/lib/constants';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';

// צבעי התצוגה לכל סטטוס - הערכים והתוויות מגיעים מ-lib/constants
const STATUS_CLASSES: Record<string, string> = {
  new: 'bg-purple-50 text-purple-700 border-purple-200',
  read: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function statusLabel(status: string): string {
  return INQUIRY_STATUSES.find((s) => s.value === status)?.label || status;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const router = useRouter();

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await authFetch('/api/inquiries');

      if (!res.ok) {
        if (res.status === 401) {
          logoutAndRedirect(router);
          return;
        }
        throw new Error('Failed to fetch');
      }

      const data = await res.json();
      setInquiries(data.inquiries || []);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('שגיאה בטעינת הפניות');
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!requireAuthOrRedirect(router)) return;
    fetchInquiries();
  }, [fetchInquiries, router]);

  const handleStatusChange = async (inquiryId: string, status: string) => {
    try {
      const res = await authFetch('/api/inquiries', {
        method: 'PUT',
        body: JSON.stringify({ inquiryId, status }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === inquiryId ? { ...i, status } : i))
        );
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleLogout = () => {
    logoutAndRedirect(router);
  };

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);
  // ספירה אחת לכל הסטטוסים - משמשת גם את הכותרת וגם את כפתורי הסינון
  const counts = inquiries.reduce<Record<string, number>>((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});
  const newCount = counts['new'] || 0;

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <SearchCheck className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">הפניות שלי</h1>
            {newCount > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                {newCount} חדשות
              </span>
            )}
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-purple-600 hover:text-pink-600 font-medium transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
              לאזור האישי
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              התנתק
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* סינון */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-center gap-2">
          {[
            { value: 'all', label: `הכל (${inquiries.length})` },
            ...INQUIRY_STATUSES.map((s) => ({
              value: s.value,
              label: `${s.label} (${counts[s.value] || 0})`,
            })),
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                filter === f.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* פניות */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">אין פניות להצגה</h3>
            <p className="text-gray-500">כשרכזות יפנו אלייך דרך האלפון - הפניות יופיעו כאן</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((inquiry) => {
              return (
                <div
                  key={inquiry.id}
                  className={`bg-white rounded-xl shadow-sm border p-5 space-y-4 ${
                    inquiry.status === 'new' ? 'border-purple-300' : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {inquiry.program?.title || 'תוכנית'}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(inquiry.createdAt).toLocaleDateString('he-IL', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium border ${STATUS_CLASSES[inquiry.status] || STATUS_CLASSES.new}`}>
                      <CircleDot className="h-3.5 w-3.5" />
                      {statusLabel(inquiry.status)}
                    </span>
                  </div>

                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-100 whitespace-pre-line">
                    {inquiry.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-purple-500" />
                      {inquiry.contactName}
                    </span>
                    {inquiry.contactInstitution && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-purple-500" />
                        {inquiry.contactInstitution}
                      </span>
                    )}
                    <a href={`tel:${inquiry.contactPhone}`} className="flex items-center gap-1.5 text-purple-600 hover:text-pink-600 font-medium" dir="ltr">
                      <Phone className="h-4 w-4" />
                      {inquiry.contactPhone}
                    </a>
                    {inquiry.contactEmail && (
                      <a href={`mailto:${inquiry.contactEmail}`} className="flex items-center gap-1.5 text-purple-600 hover:text-pink-600 font-medium">
                        <Mail className="h-4 w-4" />
                        {inquiry.contactEmail}
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    {inquiry.status === 'new' && (
                      <button
                        onClick={() => handleStatusChange(inquiry.id, 'read')}
                        className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-100 transition-all cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        סמן כנקראה
                      </button>
                    )}
                    {inquiry.status !== 'closed' && (
                      <button
                        onClick={() => handleStatusChange(inquiry.id, 'closed')}
                        className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-all cursor-pointer"
                      >
                        <CheckCircle className="h-4 w-4" />
                        סמן כטופלה
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
