'use client';

import { X, Image as ImageIcon, Video, Loader2, Save } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

interface ProgramFormProps {
  formData: {
    title: string;
    description: string;
    category: string;
    targetAge: string;
    duration: string;
    location: string;
    price: string;
    phone: string;
    email: string;
  };
  images: string[];
  videos: string[];
  loading: boolean;
  error: string;
  onFormChange: (e: any) => void;
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
  onVideoUpload: (url: string) => void;
  onVideoRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
  loadingButtonText?: string;
}

export function ProgramForm({
  formData,
  images,
  videos,
  loading,
  error,
  onFormChange,
  onImageUpload,
  onImageRemove,
  onVideoUpload,
  onVideoRemove,
  onSubmit,
  submitButtonText = 'שמור תוכנית',
  loadingButtonText = 'שומר...'
}: ProgramFormProps) {
  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
          <X className="h-5 w-5" />
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">שם התוכנית *</label>
          <input
            name="title"
            value={formData.title}
            onChange={onFormChange}
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
            placeholder=""
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">תיאור מפורט *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onFormChange}
            rows={5}
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-gray-900"
            placeholder=""
            required
          />
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
          <label className="block font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            העלאת פרסומת
          </label>
          <CldUploadWidget
            uploadPreset="producers_upload"
            onSuccess={(result: any) => {
              onImageUpload(result.info.secure_url);
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
               פרסומת
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
                  onClick={onImageRemove}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
          <label className="block font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Video className="h-5 w-5 text-pink-600" />
            סרטון דוגמה
          </label>
          <CldUploadWidget
            uploadPreset="producers_upload"
            onSuccess={(result: any) => {
              onVideoUpload(result.info.secure_url);
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
                  onClick={onVideoRemove}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">קטגוריה *</label>
            <select
              name="category"
              value={formData.category}
              onChange={onFormChange}
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
              onChange={onFormChange}
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
              onChange={onFormChange}
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
              onChange={onFormChange}
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
              onChange={onFormChange}
              placeholder="0"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">טלפון ליצירת קשר</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={onFormChange}
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
              onChange={onFormChange}
              placeholder=""
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{loadingButtonText}</span>
            </>
          ) : (
            <>
              <Save className="h-6 w-6" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>
      </form>
    </>
  );
}
