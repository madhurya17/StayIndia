import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  text: string;
  rating: number;
}

export default function TestimonialCard({ name, location, text, rating }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <Quote className="w-8 h-8 text-accent-400/40 mb-3" />
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{text}</p>
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-accent-400 fill-accent-400' : 'text-gray-200 fill-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center font-semibold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{name}</p>
          <p className="text-gray-400 text-xs">{location}</p>
        </div>
      </div>
    </div>
  );
}
