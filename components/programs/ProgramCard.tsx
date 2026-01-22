'use client';

import { MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { Program } from '@/types/program';

interface ProgramCardProps {
  program: Program;
  onClick: () => void;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6" onClick={onClick}>
      <h3 className="text-xl font-bold mb-1">{program.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{program.producer.name}</p>
      <p className="text-gray-700 mb-4 line-clamp-2">{program.description}</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{program.targetAge}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{program.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{program.duration}</span>
        </div>
        {program.price && (
          <div className="flex items-center gap-2 font-semibold">
            <DollarSign className="h-4 w-4" />
            <span>₪{program.price}</span>
          </div>
        )}
      </div>
      <span className="inline-block mt-4 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
        {program.category}
      </span>
    </div>
  );
}
