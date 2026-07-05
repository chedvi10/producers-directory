'use client';

import { Bookmark, Wallet, CheckCircle } from 'lucide-react';
import { SavedProgram } from '@/types/program';
import { StatCards } from '@/components/ui/StatCards';

interface BudgetSummaryProps {
  savedPrograms: SavedProgram[];
}

export function BudgetSummary({ savedPrograms }: BudgetSummaryProps) {
  const relevant = savedPrograms.filter((s) => s.trackStatus !== 'irrelevant');
  const closed = savedPrograms.filter((s) => s.trackStatus === 'closed');

  const totalBudget = relevant.reduce((sum, s) => sum + (s.program.price || 0), 0);
  const closedBudget = closed.reduce((sum, s) => sum + (s.program.price || 0), 0);

  return (
    <StatCards
      cards={[
        {
          icon: Bookmark,
          label: 'תוכניות שמורות',
          value: savedPrograms.length,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
        },
        {
          icon: Wallet,
          label: 'תקציב משוער (ללא "לא רלוונטי")',
          value: `₪${totalBudget.toLocaleString()}`,
          iconBg: 'bg-pink-100',
          iconColor: 'text-pink-600',
        },
        {
          icon: CheckCircle,
          label: `תקציב סגור (${closed.length} תוכניות)`,
          value: `₪${closedBudget.toLocaleString()}`,
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
        },
      ]}
    />
  );
}
