# StayIndia - Indian Hotel Booking Website

A beginner-friendly, full-stack hotel booking website built with React + Vite (frontend) and Express.js (backend) using JSON files as a mock database.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios, React Hot Toast, Lucide React Icons
- **Backend:** Node.js, Express.js, CORS
- **Database:** Local JSON files (no MongoDB or external database required)

## Quick Start

```bash
# Install all dependencies (frontend + backend)
npm install

# Start both frontend and backend servers
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API on `http://localhost:5001`. Vite proxies `/api` requests to the backend automatically.

## Default Credentials

| Role  | Email                 | Password |
|-------|-----------------------|----------|
| Admin | admin@stayindia.com  | admin123 |
| User  | user@stayindia.com   | user123  |

## Features

### User Features
- Register and Login
- Browse and Search Rooms
- Filter Rooms by City (Hyderabad, Mumbai, Chennai, Jaipur, Goa, Kochi)
- View Room Details with Amenities
- Book Rooms with Date Selection
- View and Cancel Bookings
- View Profile and Stats

### Admin Features
- Admin Login Portal
- Dashboard with Statistics
- Add, Edit, and Delete Rooms
- View All Users
- View and Cancel All Bookings
- Filter Bookings by Status

## Project Structure

```
project/
├── server/                    # Express.js backend
│   ├── index.js               # Server entry point (port 5001)
│   ├── helpers/
│   │   └── db.js              # JSON file read/write utilities
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints (register, login, logout, me)
│   │   ├── rooms.js           # Room CRUD endpoints
│   │   ├── bookings.js        # Booking endpoints
│   │   └── admin.js           # Admin endpoints (stats, users, bookings)
│   └── db/
│       ├── users.json         # User data (persists across restarts)
│       ├── rooms.json         # Room data (14 sample rooms across 6 cities)
│       └── bookings.json      # Booking data
├── src/                       # React frontend
│   ├── main.tsx               # Entry point with Toaster
│   ├── App.tsx                # Router configuration
│   ├── index.css              # Global styles
│   ├── api/
│   │   └── axios.ts           # Axios instance with auth interceptor
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state management
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── components/
│   │   ├── Navbar.tsx          # Responsive navigation bar
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Hero.tsx            # Homepage hero section with search
│   │   ├── RoomCard.tsx        # Room listing card
│   │   ├── HotelCard.tsx       # Hotel listing card
│   │   ├── TestimonialCard.tsx # Testimonial card
│   │   ├── ProtectedRoute.tsx  # Auth guard for user routes
│   │   ├── AdminRoute.tsx      # Auth guard for admin routes
│   │   ├── ConfirmDialog.tsx   # Confirmation modal
│   │   └── LoadingSpinner.tsx  # Loading indicator
│   └── pages/
│       ├── Home.tsx            # Homepage with all sections
│       ├── Login.tsx           # User login
│       ├── Register.tsx        # User registration
│       ├── Rooms.tsx           # Room listing with filters
│       ├── RoomDetails.tsx     # Room detail + booking form
│       ├── MyBookings.tsx      # User bookings management
│       ├── Profile.tsx         # User profile
│       ├── About.tsx           # About page
│       ├── Contact.tsx         # Contact page with FAQ
│       ├── AdminLogin.tsx      # Admin login portal
│       └── AdminDashboard.tsx  # Admin management dashboard
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## API Endpoints

| Method | Endpoint              | Description          | Auth     |
|--------|-----------------------|----------------------|----------|
| POST   | /api/auth/register    | Register new user    | None     |
| POST   | /api/auth/login       | Login                | None     |
| POST   | /api/auth/logout      | Logout               | None     |
| GET    | /api/auth/me          | Get current user     | Token    |
| GET    | /api/rooms            | List rooms (filter)  | None     |
| GET    | /api/rooms/:id        | Get room details     | None     |
| POST   | /api/rooms            | Add room             | Admin    |
| PUT    | /api/rooms/:id        | Edit room            | Admin    |
| DELETE | /api/rooms/:id        | Delete room          | Admin    |
| POST   | /api/bookings         | Book a room          | User     |
| GET    | /api/bookings/my/:id  | User's bookings      | User     |
| GET    | /api/bookings         | All bookings         | Admin    |
| PUT    | /api/bookings/:id/cancel | Cancel booking    | User/Admin|
| GET    | /api/admin/stats      | Dashboard stats      | Admin    |
| GET    | /api/admin/users      | All users            | Admin    |

## Color Palette

- **Primary Blue:** #1E3A5F (navy blue)
- **Accent Gold:** #D4A843 (warm gold)
- **Secondary Blue:** #3B82F6 (bright blue)
- **Background:** White and light grays

## Scripts

- `npm run dev` - Start both frontend and backend concurrently
- `npm run server` - Start only the backend server
- `npm run build` - Build the frontend for production
