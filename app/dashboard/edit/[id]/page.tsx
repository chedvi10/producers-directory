'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, X, Loader2, Edit } from 'lucide-react';
import { getAuthToken, isAuthenticated } from '@/lib/auth';
import { ProgramForm } from '@/components/dashboard/ProgramForm';

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
          phone: program.phone || data.producer.phone || '',
          email: program.email || data.producer.email || ''
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

  const removeImage = () => {
    setImages([]);
  };

  const removeVideo = () => {
    setVideos([]);
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
              submitButtonText="עדכן תוכנית"
              loadingButtonText="מעדכן..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
