'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAge: '',
    duration: '',
    location: '',
    price: '',
    tags: '',
  });

  useEffect(() => {
    const producerId = localStorage.getItem('producerId');
    if (!producerId) {
      router.push('/login');
      return;
    }
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    try {
      const res = await fetch(`/api/dashboard?producerId=${localStorage.getItem('producerId')}`);
      const data = await res.json();
      const program = data.programs.find((p: any) => p.id === params.id);
      
      if (program) {
        setFormData({
          title: program.title,
          description: program.description,
          category: program.category,
          targetAge: program.targetAge,
          duration: program.duration || '',
          location: program.location,
          price: program.price?.toString() || '',
          tags: program.tags?.join(', ') || '',
        });
      }
      setFetching(false);
    } catch (error) {
      console.error(error);
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      programId: params.id,
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    await fetch('/api/dashboard', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    router.push('/dashboard');
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (fetching) {
    return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-orange-500 hover:underline mb-6">
          <ArrowRight className="h-4 w-4" />
          חזרה לדשבורד
        </Link>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-6">עריכת תוכנית</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">שם התוכנית *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">תיאור *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">קטגוריה *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500" required>
                  <option value="">בחרי קטגוריה</option>
                  <option value="תוכניות">תוכניות</option>
                  <option value="הרצאות">הרצאות</option>
                  <option value="אטרקציות">אטרקציות</option>
                  <option value="אתרי נופש">אתרי נופש</option>
                  <option value="מסעדות">מסעדות</option>
                  <option value="מדריכות טיולים">מדריכות טיולים</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">גיל מטרה *</label>
                <select
                  name="targetAge"
                  value={formData.targetAge}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">בחרי גיל</option>
                  <option value="3-6">3-6</option>
                  <option value="7-12">7-12</option>
                  <option value="13-18">13-18</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">משך *</label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="לדוגמה: שעה וחצי"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-2">מיקום *</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="לדוגמה: תל אביב"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-2">מחיר (₪)</label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="אופציונלי"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">תגיות (מופרדות בפסיק)</label>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="לדוגמה: כיף, למידה, יצירתיות"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'שומר...' : 'עדכן תוכנית'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
