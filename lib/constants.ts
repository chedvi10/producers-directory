export const CATEGORIES = [
  'תוכניות',
  'הרצאות',
  'אטרקציות',
  'אתרי נופש',
  'מסעדות',
  'מדריכות טיולים',
];

// סטטוס מעקב של רכזת על תוכנית שמורה - מקור אמת יחיד לשרת (ולידציה) ול-UI (תוויות)
export const TRACK_STATUSES = [
  { value: 'saved', label: 'שמורה' },
  { value: 'contacted', label: 'יצרתי קשר' },
  { value: 'closed', label: 'סגרתי' },
  { value: 'irrelevant', label: 'לא רלוונטי' },
] as const;

export const TRACK_STATUS_VALUES = TRACK_STATUSES.map((s) => s.value as string);

// סטטוס פנייה אצל המפיקה
export const INQUIRY_STATUSES = [
  { value: 'new', label: 'חדשה' },
  { value: 'read', label: 'נקראה' },
  { value: 'closed', label: 'טופלה' },
] as const;

export const INQUIRY_STATUS_VALUES = INQUIRY_STATUSES.map((s) => s.value as string);

export const TARGET_AGES = [
  'בנים 3-6',
  'בנים 6-12',
  'בנים 12-18',
  'בנים 18+',
  'בנות 3-6',
  'בנות 6-12',
  'בנות 12-18',
  'בנות 18+',
];
