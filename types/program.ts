export interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAge: string;
  duration: string;
  location: string;
  price: number | null;
  phone?: string;  // 👈 הוסף - טלפון ספציפי לתוכנית
  email?: string;  // 👈 הוסף - אימייל ספציפי לתוכנית
  tags?: string[];
  images?: string[];
  videos?: string[];
  createdAt?: string;
  status?: string;  // 👈 הוסף - סטטוס התוכנית
  producer: {
    name: string;
    phone: string;
    email?: string;  // 👈 הוסף - אימייל של המפיקה
  };
}

export interface DashboardProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAge: string;
  duration?: string;
  location: string;
  price: number | null;
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
  subscription?: Subscription;
}
