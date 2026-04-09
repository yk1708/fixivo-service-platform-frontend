import { Link } from 'react-router';
import { MapPin, Clock, BadgeCheck } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { ImageWithFallback } from './error/error';

export function WorkerCard({ worker, onRequest }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative">
        <ImageWithFallback
          src={worker.image}
          alt={worker.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {worker.verified && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
            <BadgeCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-xs text-[#10B981]" style={{ fontWeight: 600 }}>Verified</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-[#F97316] text-white px-2.5 py-1 rounded-lg text-xs" style={{ fontWeight: 600 }}>
          {worker.price}/hr
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-gray-900 text-sm mb-0.5" style={{ fontWeight: 700 }}>{worker.name}</h3>
            <p className="text-[#1E40AF] text-xs" style={{ fontWeight: 500 }}>{worker.profession}</p>
          </div>
          <div className="flex items-center gap-1">
            <RatingStars rating={worker.rating} size="sm" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span style={{ fontWeight: 500 }}>{worker.rating} ({worker.reviews} reviews)</span>
          <span className="text-gray-400">|</span>
          <span style={{ fontWeight: 500 }}>{worker.experience} exp</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
          <MapPin className="w-3 h-3 text-[#F97316]" />
          <span>{worker.location}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <Clock className="w-3 h-3 text-[#10B981]" />
          <span className="text-[#10B981]" style={{ fontWeight: 500 }}>{worker.availability}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onRequest?.(worker.id)}
            className="flex-1 py-2.5 bg-[#1E40AF] text-white rounded-xl text-xs hover:bg-blue-900 transition-colors"
            style={{ fontWeight: 600 }}
          >
            Send Request
          </button>
          <Link
            to={`/worker/${worker.id}`}
            className="flex-1 py-2.5 border border-[#1E40AF] text-[#1E40AF] rounded-xl text-xs text-center hover:bg-[#1E40AF] hover:text-white transition-colors"
            style={{ fontWeight: 600 }}
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
