import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header עם כפתור כניסה */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">מדריך תוכניות</h1>
          <Link
            href="/login"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            כניסה למפיקות
          </Link>
        </div>
      </nav>

      {/* תוכן ראשי */}
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6 p-8">
          <h2 className="text-6xl text-orange-400 font-bold">מדריך תוכניות</h2>
          <p className="text-xl text-gray-600">כל מה שאת צריכה לארוע שלך במקום אחד</p>
          <Link
            href="/programs"
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition"
          >
            לצפיה
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm">© 2026 מדריך תוכניות. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}
