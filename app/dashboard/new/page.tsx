'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getAuthToken } from '@/lib/auth';
import { ProgramForm } from '@/components/dashboard/ProgramForm';

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
          חזרה לאזור האישי
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
            <ProgramForm
              formData={formData}
              images={images}
              videos={videos}
              loading={loading}
              error={error}
              onFormChange={handleChange}
              onImageUpload={(url) => setImages([url])}
              onImageRemove={() => setImages([])}
              onVideoUpload={(url) => setVideos([url])}
              onVideoRemove={() => setVideos([])}
              onSubmit={handleSubmit}
              submitButtonText="שמור תוכנית"
              loadingButtonText="שומר..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
