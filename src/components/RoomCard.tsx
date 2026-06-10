import { Link } from 'react-router-dom';
import { MapPin, Star, Users, IndianRupee } from 'lucide-react';
import type { Room } from '../types';

export default function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      to={`/rooms/${room.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      <div className="relative overflow-hidden">
        <img
          src={room.image}
          alt={room.roomName}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-primary-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
          {room.roomType}
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
              room.availability
                ? 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}
          >
            {room.availability ? 'Available' : 'Booked'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
          <MapPin className="w-3 h-3" />
          <span>{room.city}</span>
        </div>

        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-primary-500 transition-colors">
          {room.roomName}
        </h3>
        <p className="text-gray-500 text-sm mb-3">{room.hotelName}</p>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(room.rating)
                  ? 'text-accent-400 fill-accent-400'
                  : 'text-gray-200 fill-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">{room.rating}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full">
              +{room.amenities.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-primary-500 font-bold text-lg">
            <IndianRupee className="w-4 h-4" />
            {room.price.toLocaleString('en-IN')}
            <span className="text-gray-400 text-xs font-normal">/night</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Users className="w-3 h-3" />
            <span>{room.capacity} guests</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
