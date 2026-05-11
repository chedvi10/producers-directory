'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, X, Image as ImageIcon, Video, Sparkles, Loader2, Save } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { getAuthToken } from '@/lib/auth';

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAge: '',
    duration: '',
    location: '',
    price: '',
    phone: '',
    email: ''
  });

  // מילוי אוטומטי של פרטי המפיקה
  useEffect(() => {
    const fetchProducerData = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.producer) {
            setFormData(prev => ({
              ...prev,
              phone: data.producer.phone || '',
              email: data.producer.email || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching producer data:', error);
      }
    };

    fetchProducerData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }
      
      const data = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        images,
        videos
      };

      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('השרת החזיר תגובה לא תקינה');
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'שגיאה בשמירה');
      }

      alert('התוכנית נשמרה בהצלחה!');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'שגיאה בשמירת התוכנית');
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const removeImage = () => {
    setImages([]);
  };

  const removeVideo = () => {
    setVideos([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* כפתור חזרה */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-purple-600 hover:text-pink-600 font-medium mb-6 transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
          חזרה לדשבורד
        </Link>

        {/* כרטיס הטופס */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-3 rounded-xl">
                <Sparkles className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold">הוספת תוכנית חדשה</h1>
            </div>
            <p className="text-purple-100">מלאי את הפרטים והתוכנית שלך תעלה לאלפון</p>
          </div>

          {/* טופס */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                <X className="h-5 w-5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* שם התוכנית */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">שם התוכנית *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  placeholder=""
                  required
                />
              </div>

              {/* תיאור */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">תיאור מפורט *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-gray-900"
                  placeholder="תארי את התוכנית בפירוט..."
                  required
                />
              </div>

              {/* תמונה */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <label className="block font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-600" />
                  תמונת דוגמה
                </label>
                <CldUploadWidget
                  uploadPreset="producers_upload"
                  onSuccess={(result: any) => {
                    setImages([result.info.secure_url]);
                  }}
                  options={{
                    maxFiles: 1,
                    resourceType: 'image',
                    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                    maxFileSize: 5000000
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 hover:bg-purple-100 transition-all font-medium text-purple-700"
                    >
                      <ImageIcon className="h-5 w-5" />
                      העלאת תמונה
                    </button>
                  )}
                </CldUploadWidget>

                {images.length > 0 && (
                  <div className="mt-4">
                    <div className="relative group">
                      <img
                        src={images[0]}
                        alt="תמונת התוכנית"
                        className="w-full h-60 object-cover rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* וידאו */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
                <label className="block font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Video className="h-5 w-5 text-pink-600" />
                  סרטון דוגמה
                </label>
                <CldUploadWidget
                  uploadPreset="producers_upload"
                  onSuccess={(result: any) => {
                    setVideos([result.info.secure_url]);
                  }}
                  options={{
                    maxFiles: 1,
                    resourceType: 'video',
                    clientAllowedFormats: ['mp4', 'mov', 'avi', 'webm'],
                    maxFileSize: 50000000
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-pink-300 rounded-xl hover:border-pink-500 hover:bg-pink-100 transition-all font-medium text-pink-700"
                    >
                      <Video className="h-5 w-5" />
                      העלאת וידאו
                    </button>
                  )}
                </CldUploadWidget>

                {videos.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow">
                      <span className="text-sm font-medium text-gray-700">וידאו התוכנית</span>
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* שדות נוספים */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">קטגוריה *</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition-all text-gray-900" 
                    required
                  >
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
                  <label className="block font-semibold text-gray-700 mb-2">גיל מטרה *</label>
                  <select 
                    name="targetAge" 
                    value={formData.targetAge} 
                    onChange={handleChange} 
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition-all text-gray-900" 
                    required
                  >
                    <option value="">בחרי גיל מטרה</option>
                    <option value="בנים 3-6">בנים 3-6</option>
                    <option value="בנים 6-12">בנים 6-12</option>
                    <option value="בנים 12-18">בנים 12-18</option>
                    <option value="בנים 18+">בנים 18+</option>
                    <option value="בנות 3-6">בנות 3-6</option>
                    <option value="בנות 6-12">בנות 6-12</option>
                    <option value="בנות 12-18">בנות 12-18</option>
                    <option value="בנות 18+">בנות 18+</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">משך *</label>
                  <input
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">מיקום *</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">מחיר (₪)</label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">טלפון ליצירת קשר</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-2">אימייל ליצירת קשר</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
                  />
                </div>
              </div>

              {/* כפתור שמירה */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>שומר...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-6 w-6" />
                    <span>שמור תוכנית</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
