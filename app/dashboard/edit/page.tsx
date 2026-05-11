'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, X, Image as ImageIcon, Video, Loader2, Save, Edit } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { getAuthToken, isAuthenticated } from '@/lib/auth';

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch');
      }

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
          phone: program.phone || data.producer.phone || '', // 👈 עדיפות לטלפון של התוכנית, אחר כך של המפיקה
          email: program.email || data.producer.email || ''   // 👈 עדיפות לאימייל של התוכנית, אחר כך של המפיקה
        });
        setImages(program.images || []);
        setVideos(program.videos || []);
      }
      setFetching(false);
    } catch (error) {
      console.error(error);
      setError('שגיאה בטעינת התוכנית');
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      const data = {
        programId: params.id,
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        images,
        videos,
      };

      const res = await fetch('/api/dashboard', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'שגיאה בעדכון');
      }

      alert('התוכנית עודכנה בהצלחה!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">טוען את התוכנית...</p>
        </div>
      </div>
    );
  }

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
                <Edit className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold">עריכת תוכנית</h1>
            </div>
            <p className="text-purple-100">עדכני את פרטי התוכנית שלך</p>
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
                  placeholder="לדוגמה: תוכנית קסמים מרהיבה"
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

              {/* תמונות */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <label className="block font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-600" />
                  תמונות דוגמה
                </label>
                <CldUploadWidget
                  uploadPreset="producers_upload"
                  onSuccess={(result: any) => {
                    setImages([...images, result.info.secure_url]);
                  }}
                  options={{
                    maxFiles: 5,
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
                      העלאת תמונות (עד 5)
                    </button>
                  )}
                </CldUploadWidget>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`תמונה ${index + 1}`}
                          className="w-full h-40 object-cover rounded-xl shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* וידאו */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
                <label className="block font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Video className="h-5 w-5 text-pink-600" />
                  סרטוני דוגמה
                </label>
                <CldUploadWidget
                  uploadPreset="producers_upload"
                  onSuccess={(result: any) => {
                    setVideos([...videos, result.info.secure_url]);
                  }}
                  options={{
                    maxFiles: 3,
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
                      העלאת וידאו (עד 3)
                    </button>
                  )}
                </CldUploadWidget>

                {videos.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {videos.map((url, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow">
                        <span className="text-sm font-medium text-gray-700">וידאו {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
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
                    <option value="programs">תוכניות</option>
                    <option value="lectures">הרצאות</option>
                    <option value="attractions">אטרקציות</option>
                    <option value="restaurants">מסעדות</option>
                    <option value="tours">מדריכות טיולים</option>
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

              {/* כפתור עדכון */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>מעדכן...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-6 w-6" />
                    <span>עדכן תוכנית</span>
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
