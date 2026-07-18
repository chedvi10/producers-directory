'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, Inbox, Check } from 'lucide-react';
import { ProgramStats } from '@/types/program';
import { authFetch } from '@/lib/auth';
import { StatCards } from '@/components/ui/StatCards';

interface StatsTotals {
  views: number;
  inquiries: number;
  saved: number;
  newInquiries: number;
}

interface StatsOverviewProps {
  onStatsLoaded?: (stats: ProgramStats[]) => void;
}

export function StatsOverview({ onStatsLoaded }: StatsOverviewProps) {
  const [totals, setTotals] = useState<StatsTotals | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await authFetch('/api/dashboard/stats', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setTotals(data.totals);
      onStatsLoaded?.(data.stats || []);
    } catch {
      // סטטיסטיקות הן תוספת - לא מפילים את הדשבורד אם נכשלו
    }
  }, [onStatsLoaded]);

  useEffect(() => {
    const initialFetchTimer = window.setTimeout(() => {
      void fetchStats();
    }, 0);

    const handleFocus = () => {
      fetchStats();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats();
      }
    };

    const intervalId = window.setInterval(fetchStats, 10000);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(initialFetchTimer);
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchStats]);

  if (!totals) return null;

  return (
    <StatCards
      cards={[
        {
          icon: Eye,
          label: 'צפיות בתוכניות שלי',
          value: totals.views,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
        },
        {
          icon: Inbox,
          label: 'פניות שקיבלתי',
          value: totals.inquiries,
          iconBg: 'bg-pink-100',
          iconColor: 'text-pink-600',
          badge: totals.newInquiries > 0 ? `${totals.newInquiries} חדשות` : null,
          href: '/dashboard/inquiries',
        },
        {
          icon: Check,
          label: 'שמירות על ידי רכזות',
          value: totals.saved,
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
        },
      ]}
    />
  );
}
