import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

interface HotelCardProps {
  hotelName: string;
  city: string;
  image: string;
  rating: number;
  priceRange: string;
  roomCount: number;
}

export default function HotelCard({ hotelName, city, image, rating, priceRange, roomCount }: HotelCardProps) {
  return (
    <Link
      to={`/rooms?search=${encodeURIComponent(hotelName)}`}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 aspect-[4/3]"
    >
      <img
        src={image}
        alt={hotelName}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-1 text-primary-200 text-xs mb-1">
          <MapPin className="w-3 h-3" />
          {city}
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">{hotelName}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent-400 fill-accent-400" />
            <span className="text-white text-sm font-medium">{rating}</span>
          </div>
          <span className="text-primary-200 text-xs">
            {roomCount} room{roomCount > 1 ? 's' : ''} available
          </span>
        </div>
        <p className="text-accent-400 text-sm font-medium mt-1">{priceRange}</p>
      </div>
    </Link>
  );
}
