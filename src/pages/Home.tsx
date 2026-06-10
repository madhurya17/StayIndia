import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star, Wallet, Headphones, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Hero from '../components/Hero';
import RoomCard from '../components/RoomCard';
import HotelCard from '../components/HotelCard';
import TestimonialCard from '../components/TestimonialCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import type { Room } from '../types';

const destinationImages: Record<string, string> = {
  Hyderabad: 'https://images.unsplash.com/photo-1657981630164-769503f3a9a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aHlkZXJhYmFkfGVufDB8fDB8fHww',
  Mumbai: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bXVtYmFpfGVufDB8fDB8fHww',
  Chennai: 'https://images.unsplash.com/photo-1637080618498-b4a1cad84ae0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hlbm5haXxlbnwwfHwwfHx8MA%3D%3D',
  Jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80',
  Goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29hfGVufDB8fDB8fHww',
  Kochi: 'https://images.unsplash.com/photo-1558013400-b724200f9c39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a29jaGl8ZW58MHx8MHx8fDA%3D',
};

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/rooms')
      .then((res) => setRooms(res.data))
      .catch(() => toast.error('Failed to load rooms'))
      .finally(() => setLoading(false));
  }, []);

  const featuredHotels = rooms.reduce((acc, room) => {
    if (!acc.find((h) => h.hotelName === room.hotelName)) {
      const hotelRooms = rooms.filter((r) => r.hotelName === room.hotelName);
      const minPrice = Math.min(...hotelRooms.map((r) => r.price));
      const maxPrice = Math.max(...hotelRooms.map((r) => r.price));
      acc.push({
        hotelName: room.hotelName,
        city: room.city,
        image: room.image,
        rating: room.rating,
        priceRange: minPrice === maxPrice ? `From ${minPrice.toLocaleString('en-IN')}` : `${minPrice.toLocaleString('en-IN')} - ${maxPrice.toLocaleString('en-IN')}`,
        roomCount: hotelRooms.length,
      });
    }
    return acc;
  }, [] as { hotelName: string; city: string; image: string; rating: number; priceRange: string; roomCount: number }[]);

  const featuredRooms = rooms.filter((r) => r.rating >= 4.5).slice(0, 6);
  const availableRooms = rooms.filter((r) => r.availability);

  return (
    <div>
      <Hero />

      {/* Featured Hotels */}
      <section id="featured-hotels" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Featured Hotels</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Handpicked Premium Hotels
            </h2>
            <div className="w-16 h-1 bg-accent-400 rounded-full mx-auto mt-4" />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" message="Loading hotels..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredHotels.slice(0, 4).map((hotel) => (
                <HotelCard key={hotel.hotelName} {...hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Featured Rooms</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Top-Rated Rooms
            </h2>
            <div className="w-16 h-1 bg-accent-400 rounded-full mx-auto mt-4" />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" message="Loading rooms..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-all duration-200 shadow-md"
            >
              View All Rooms
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Explore India</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Popular Destinations
            </h2>
            <div className="w-16 h-1 bg-accent-400 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(destinationImages).map(([city, image]) => {
              const cityRooms = availableRooms.filter((r) => r.city === city);
              return (
                <Link
                  key={city}
                  to={`/rooms?city=${city}`}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 aspect-[3/4]"
                >
                  <img
                    src={image}
                    alt={city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-primary-900/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-white/70 text-xs mb-1">
                      <MapPin className="w-3 h-3" />
                      {cityRooms.length} rooms
                    </div>
                    <h3 className="text-white font-semibold text-lg">{city}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Why StayIndia</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Why Choose Us
            </h2>
            <div className="w-16 h-1 bg-accent-400 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Secure Booking', desc: 'Your data and payments are always safe with our secure booking system.' },
              { icon: Star, title: 'Best Quality', desc: 'Every hotel is handpicked and verified to meet our high quality standards.' },
              { icon: Wallet, title: 'Best Prices', desc: 'Get the most competitive rates with our price match guarantee.' },
              { icon: Headphones, title: '24/7 Support', desc: 'Round the clock customer support to assist you anytime, anywhere.' },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              What Our Guests Say
            </h2>
            <div className="w-16 h-1 bg-accent-400 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              name="Priya Patel"
              location="Mumbai, India"
              text="StayIndia made our family trip to Jaipur absolutely magical. The Rambagh Palace experience was beyond our expectations. The booking process was seamless and the customer support was outstanding."
              rating={5}
            />
            <TestimonialCard
              name="Arjun Reddy"
              location="Hyderabad, India"
              text="I have been using StayIndia for all my business trips across India. The hotel quality is consistently excellent and the prices are very competitive. Highly recommended for frequent travelers."
              rating={4}
            />
            <TestimonialCard
              name="Sneha Nair"
              location="Kochi, India"
              text="Our honeymoon in Goa was perfectly planned with StayIndia. The beachfront suite was exactly as described and the backwater premium room in Kochi was a serene experience. Will definitely book again."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-20 bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Get In Touch</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-6">
                Need Help Planning Your Stay?
              </h2>
              <p className="text-primary-200 leading-relaxed mb-8">
                Our travel experts are here to help you find the perfect hotel for your trip. Whether it's a business stay, family vacation, or romantic getaway, we've got you covered.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-400 text-primary-900 rounded-xl font-semibold hover:bg-accent-300 transition-colors duration-200"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-primary-400/20 rounded-xl p-4">
                <Phone className="w-6 h-6 text-accent-400" />
                <div>
                  <p className="text-primary-200 text-sm">Call us anytime</p>
                  <p className="font-semibold">+91-1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-primary-400/20 rounded-xl p-4">
                <Mail className="w-6 h-6 text-accent-400" />
                <div>
                  <p className="text-primary-200 text-sm">Email us</p>
                  <p className="font-semibold">hello@stayindia.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-primary-400/20 rounded-xl p-4">
                <MapPin className="w-6 h-6 text-accent-400" />
                <div>
                  <p className="text-primary-200 text-sm">Visit us</p>
                  <p className="font-semibold">Miyapur, Hyderabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
