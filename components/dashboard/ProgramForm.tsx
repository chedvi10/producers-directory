'use client';

import { X, Image as ImageIcon, Video, Loader2, Save } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { CATEGORIES, TARGET_AGES } from '@/lib/constants';

interface ProgramFormProps {
  formData: {
    title: string;
    description: string;
    category: string;
    audience?: 'MEN' | 'WOMEN' | 'BOTH';
    minAge: number | string;
    maxAge: number | string;
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

        <div>
          <label className="block font-semibold text-gray-700 mb-2">מי מיועדת התוכנית</label>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <input type="radio" name="audience" value="MEN" checked={formData.audience === 'MEN'} onChange={onFormChange} />
              <span className="text-sm">גברים</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="audience" value="WOMEN" checked={formData.audience === 'WOMEN'} onChange={onFormChange} />
              <span className="text-sm">נשים</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="audience" value="BOTH" checked={formData.audience === 'BOTH' || !formData.audience} onChange={onFormChange} />
              <span className="text-sm">גם גברים וגם נשים</span>
            </label>
          </div>
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
             להעלאת טריילר
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
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">גיל מינימום *</label>
            <input
              name="minAge"
              type="number"
              min={1}
              max={120}
              step={1}
              value={formData.minAge}
              onChange={onFormChange}
              placeholder="1"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">גיל מקסימום *</label>
            <input
              name="maxAge"
              type="number"
              min={1}
              max={120}
              step={1}
              value={formData.maxAge}
              onChange={onFormChange}
              placeholder="120"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
              required
            />
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
