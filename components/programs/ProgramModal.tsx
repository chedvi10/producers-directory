'use client';

import { X, Users, MapPin, Clock, DollarSign, Phone, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { Program } from '@/types/program';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

interface ProgramModalProps {
  program: Program;
  onClose: () => void;
}

export function ProgramModal({ program, onClose }: ProgramModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{program.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* תמונות */}
          {program.images && program.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                תמונות
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {program.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${program.title} - תמונה ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow hover:shadow-lg transition"
                  />
                ))}
              </div>
            </div>
          )}

          {/* וידאו */}
          {program.videos && program.videos.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <VideoIcon className="h-5 w-5" />
                סרטונים
              </h3>
              <div className="space-y-4">
                {program.videos.map((url, index) => (
                  <video
                    key={index}
                    src={url}
                    controls
                    className="w-full rounded-lg shadow"
                  >
                    הדפדפן שלך לא תומך בהצגת וידאו.
                  </video>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-2">תיאור</h3>
            <p className="text-gray-700">{program.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">גיל מטרה</p>
                <p className="font-medium">{program.targetAge}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">מיקום</p>
                <p className="font-medium">{program.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">משך</p>
                <p className="font-medium">{program.duration}</p>
              </div>
            </div>
            {program.price && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">מחיר</p>
                  <p className="font-medium">₪{program.price}</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">יצירת קשר</h3>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <span>{program.producer.name} - {program.producer.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
