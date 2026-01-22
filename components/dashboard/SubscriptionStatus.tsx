'use client';

import { Calendar } from 'lucide-react';
import { Subscription } from '@/types/program';

interface SubscriptionStatusProps {
  subscription?: Subscription;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <div className="bg-red-50 text-red-600 p-3 rounded">
        אין מנוי פעיל
      </div>
    );
  }

  const expiryDate = new Date(subscription.expiryDate);
  const isExpired = expiryDate < new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`p-3 rounded flex items-center gap-2 ${
      isExpired ? 'bg-red-50 text-red-600' : 
      daysLeft < 30 ? 'bg-yellow-50 text-yellow-600' : 
      'bg-green-50 text-green-600'
    }`}>
      <Calendar className="h-5 w-5" />
      <div>
        <p className="font-semibold">
          {isExpired ? 'המנוי פג תוקף' : `מנוי פעיל - ${daysLeft} ימים נותרו`}
        </p>
        <p className="text-sm">תוקף עד: {expiryDate.toLocaleDateString('he-IL')}</p>
      </div>
    </div>
  );
}
