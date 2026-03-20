/**
 * RatingStars — interactive 1-5 star rating selector or static display.
 */
import { Star } from 'lucide-react';

export default function RatingStars({ value = 0, onChange, size = 'md', max = 5 }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          className={onChange ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          disabled={!onChange}
        >
          <Star
            className={`${sizes[size]} transition-colors ${
              i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}