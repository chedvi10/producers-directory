export interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  minAge: number;
  maxAge: number;
  duration: string;
  location: string;
  price: number | null;
  audience?: 'MEN' | 'WOMEN' | 'BOTH';
  phone?: string;  
  email?: string;  
  tags?: string[];
  images?: string[];
  videos?: string[];
  createdAt?: string;
  status?: string;  
  producer: {
    name: string;
    phone: string;
    email?: string; 
  };
}

export interface DashboardProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  minAge: number;
  maxAge: number;
  duration?: string;
  location: string;
  price: number | null;
  audience?: 'MEN' | 'WOMEN' | 'BOTH';
  phone?: string;  // 👈 הוסף - טלפון ספציפי לתוכנית
  email?: string;  // 👈 הוסף - אימייל ספציפי לתוכנית
  tags?: string[];
  images?: string[];
  videos?: string[];
  createdAt: string;
  status?: string;  // 👈 הוסף - סטטוס התוכנית (pending/approved/rejected)
}

export interface Subscription {
  expiryDate: string;
}

export interface Producer {
  id: string;
  name: string;
  email: string;
  phone: string;
  institution?: string;
  role?: string; // producer / coordinator / admin
  subscription?: Subscription;
}

// תוכנית שמורה של רכזת (מועדפים + הערה + סטטוס מעקב)
export interface SavedProgram {
  id: string;
  note: string | null;
  trackStatus: string; // saved / contacted / closed / irrelevant
  programId: string;
  createdAt: string;
  program: Program;
}

// פנייה מרכזת אל מפיקה
export interface Inquiry {
  id: string;
  message: string;
  status: string; // new / read / closed
  contactName: string;
  contactPhone: string;
  contactEmail?: string | null;
  contactInstitution?: string | null;
  programId: string;
  createdAt: string;
  program?: {
    title: string;
  };
}

// סטטיסטיקות תוכנית למפיקה
export interface ProgramStats {
  programId: string;
  title: string;
  views: number;
  inquiriesCount: number;
  savedCount: number;
}
