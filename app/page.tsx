import Link from 'next/link';
import { Sparkles, Search, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header קומפקטי */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fade-in-up">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              מדריך תוכניות
            </h1>
          </div>
          <Link
            href="/login"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full hover:shadow-lg transition-all duration-300 font-medium text-sm button-hover ripple"
          >
            כניסה למפיקות
          </Link>
        </div>
      </nav>

      {/* Hero Section - ממורכז */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium fade-in-up delay-100">
            <TrendingUp className="h-4 w-4" />
            <span>הפלטפורמה המובילה לאירועים</span>
          </div>

          {/* כותרת ראשית */}
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight fade-in-up delay-200">
            מדריך תוכניות
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto fade-in-up delay-300">
            כל מה שאת צריכה לארוע שלך במקום אחד
            <br />
            <span className="text-purple-600 font-semibold">מאות תוכניות, מפיקות ומרצים</span>
          </p>

          {/* כפתורים */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2 fade-in-up delay-400">
            <Link
              href="/programs"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-7 py-3 rounded-full text-base font-semibold hover:shadow-2xl transition-all duration-300 button-hover ripple"
            >
              <Search className="h-5 w-5" />
              <span>חיפוש תוכניות</span>
            </Link>
            
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-7 py-3 rounded-full text-base font-semibold border-2 border-purple-200 hover:border-purple-600 hover:shadow-lg transition-all duration-300 button-hover ripple"
            >
              <Sparkles className="h-5 w-5" />
              <span>הצטרפי כמפיקה</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer קומפקטי */}
      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">מדריך תוכניות</span>
            </div>
            <p className="text-purple-200">
              © 2026 מדריך תוכניות. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
