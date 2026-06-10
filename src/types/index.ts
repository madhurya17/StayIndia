export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Room {
  id: string;
  hotelName: string;
  roomName: string;
  city: string;
  description: string;
  price: number;
  rating: number;
  amenities: string[];
  availability: boolean;
  capacity: number;
  roomType: string;
  image: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  room?: Room | null;
  user?: { id: string; name: string; email: string; phone: string } | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
}

export interface AdminStats {
  totalRooms: number;
  totalUsers: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
}
