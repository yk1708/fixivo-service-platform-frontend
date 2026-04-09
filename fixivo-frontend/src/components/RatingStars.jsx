import { Star } from 'lucide-react';

export function RatingStars({ rating, maxStars = 5, size = 'sm', showNumber = false }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <Star
            key={i}
            className={`${sizeClass} ${filled || partial ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
          />
        );
      })}
      {showNumber && (
        <span className="text-sm text-gray-700 ml-1" style={{ fontWeight: 600 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
