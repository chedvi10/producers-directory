'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2, Edit } from 'lucide-react';
import { getAuthToken, getUserRole, isAuthenticated, redirectToRoleHome } from '@/lib/auth';
import { getErrorMessage } from '@/lib/errors';
import { showSuccessPopup } from '@/lib/popup';
import { ProgramForm } from '@/components/dashboard/ProgramForm';

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    audience: 'BOTH' as 'MEN' | 'WOMEN' | 'BOTH',
    minAge: '',
    maxAge: '',
    duration: '',
    location: '',
    price: '',
    phone: '',
    email: ''
  });

  const fetchProgram = useCallback(async () => {
    try {
      if (!programId) {
        setError('מזהה תוכנית לא תקין');
        setFetching(false);
        return;
      }

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
        if (res.status === 403) {
          redirectToRoleHome(router);
          return;
        }
        const errorBody = await res.text();
        throw new Error(`Failed to fetch (${res.status}): ${errorBody || res.statusText}`);
      }

        const data = await res.json();
        const program = data.programs.find((p: { id: string }) => p.id === programId);
      
      if (program) {
        setFormData({
          title: program.title,
          description: program.description,
          category: program.category,
          audience: program.audience || 'BOTH',
          minAge: program.minAge,
          maxAge: program.maxAge,
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
  }, [programId, router]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const role = getUserRole();
    if (role && role !== 'producer') {
      redirectToRoleHome(router);
      return;
    }

    fetchProgram();
  }, [fetchProgram, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const minAge = parseInt(formData.minAge as string, 10);
    const maxAge = parseInt(formData.maxAge as string, 10);

    if (Number.isNaN(minAge) || Number.isNaN(maxAge)) {
      setError('יש להזין גיל מינימום וגיל מקסימום תקינים');
      setLoading(false);
      return;
    }

    if (minAge < 1 || minAge > 120 || maxAge < 1 || maxAge > 120) {
      setError('הגיל חייב להיות בין 1 ל-120');
      setLoading(false);
      return;
    }

    if (minAge > maxAge) {
      setError('גיל מינימום לא יכול להיות גבוה מגיל מקסימום');
      setLoading(false);
      return;
    }

    try {
      if (!programId) {
        setError('מזהה תוכנית לא תקין');
        setLoading(false);
        return;
      }

      const token = getAuthToken();
      const data = {
        programId,
        ...formData,
        minAge,
        maxAge,
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

      await showSuccessPopup('התוכנית עודכנה בהצלחה', 'השינויים נשמרו ואפשר לחזור לאזור האישי.');
      router.push('/dashboard');
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'שגיאה בעדכון'));
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          חזרה לאזור האישי
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
