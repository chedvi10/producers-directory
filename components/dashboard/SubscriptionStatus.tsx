'use client';

import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Subscription } from '@/types/program';

interface SubscriptionStatusProps {
  subscription?: Subscription;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <div className="bg-red-100 p-2 rounded-lg">
          <XCircle className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <p className="font-semibold text-red-800">אין מנוי פעיל</p>
          <p className="text-sm text-red-600">יש להירשם למנוי כדי להציג תוכניות</p>
        </div>
      </div>
    );
  }

  const expiryDate = new Date(subscription.expiryDate);
  const isExpired = expiryDate < new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`border rounded-lg p-4 flex items-center gap-3 ${
      isExpired ? 'bg-red-50 border-red-200' : 
      daysLeft < 30 ? 'bg-amber-50 border-amber-200' : 
      'bg-emerald-50 border-emerald-200'
    }`}>
      <div className={`p-2 rounded-lg ${
        isExpired ? 'bg-red-100' : 
        daysLeft < 30 ? 'bg-amber-100' : 
        'bg-emerald-100'
      }`}>
        {isExpired ? (
          <XCircle className="h-5 w-5 text-red-600" />
        ) : daysLeft < 30 ? (
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        ) : (
          <CheckCircle className="h-5 w-5 text-emerald-600" />
        )}
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${
          isExpired ? 'text-red-800' : 
          daysLeft < 30 ? 'text-amber-800' : 
          'text-emerald-800'
        }`}>
          {isExpired ? 'המנוי פג תוקף' : `מנוי פעיל - ${daysLeft} ימים נותרו`}
        </p>
        <p className={`text-sm ${
          isExpired ? 'text-red-600' : 
          daysLeft < 30 ? 'text-amber-600' : 
          'text-emerald-600'
        }`}>
          תוקף עד: {expiryDate.toLocaleDateString('he-IL')}
        </p>
      </div>
    </div>
  );
}
