'use client';

import { useState, useEffect } from 'react';
import { Eye, Inbox, Star } from 'lucide-react';
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await authFetch('/api/dashboard/stats');
        if (!res.ok) return;
        const data = await res.json();
        setTotals(data.totals);
        onStatsLoaded?.(data.stats || []);
      } catch {
        // סטטיסטיקות הן תוספת - לא מפילים את הדשבורד אם נכשלו
      }
    };
    fetchStats();
  }, []);

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
          icon: Star,
          label: 'שמירות על ידי רכזות',
          value: totals.saved,
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
        },
      ]}
    />
  );
}
