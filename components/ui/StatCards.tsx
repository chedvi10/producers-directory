'use client';

import Link from 'next/link';
import { ArrowLeft, LucideIcon } from 'lucide-react';

export interface StatCard {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
  badge?: string | null;
  href?: string;
}

interface StatCardsProps {
  cards: StatCard[];
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const content = (
          <>
            <div className={`${card.iconBg} p-3 rounded-xl`}>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                {card.badge && (
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
            {card.href && <ArrowLeft className="h-5 w-5 text-gray-300" />}
          </>
        );

        return card.href ? (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md hover:border-purple-200 transition-all"
          >
            {content}
          </Link>
        ) : (
          <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
            {content}
          </div>
        );
      })}
    </div>
  );
}
