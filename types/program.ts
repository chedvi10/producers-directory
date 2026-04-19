export interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAge: string;
  duration: string;
  location: string;
  price: number | null;
  tags?: string[];
  images?: string[];  // 👈 חדש
  videos?: string[];  // 👈 חדש
  createdAt?: string;
  producer: {
    name: string;
    phone: string;
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
  tags?: string[];
  images?: string[];  // 👈 חדש
  videos?: string[];  // 👈 חדש
  createdAt: string;
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
