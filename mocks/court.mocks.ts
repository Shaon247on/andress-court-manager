export type CourtStatus = 'Active' | 'Maintenance';
export type CourtEnvironment = 'Indoor' | 'Outdoor' | 'Both';

export interface Court {
  id: number;
  name: string;
  location: string;
  type: string;
  surface: string;
  status: CourtStatus;
  environment: CourtEnvironment;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  bookings: number;
  revenue: string;
  description: string;
  gameFormat: string;
}

// NOTE: This is in-memory mock data for prototyping the UI only.
// Swap this out for real data fetching (API route / server action) when wiring up the backend.
export const mockCourts: Court[] = [
  {
    id: 1,
    name: 'Arena Pro - Court A',
    location: 'Athens',
    type: 'Football',
    surface: 'Artificial Turf',
    status: 'Maintenance',
    environment: 'Outdoor',
    price: 50,
    currency: '€',
    rating: 4.9,
    reviews: 145,
    bookings: 145,
    revenue: '€18,450',
    description: 'A premium outdoor artificial turf pitch with floodlights, ideal for evening 11v11 matches.',
    gameFormat: '11vs11',
  },
  {
    id: 2,
    name: 'Arena Pro - Court B',
    location: 'Athens',
    type: 'Football',
    surface: 'Artificial Turf',
    status: 'Active',
    environment: 'Indoor',
    price: 45,
    currency: '€',
    rating: 4.7,
    reviews: 128,
    bookings: 128,
    revenue: '€15,200',
    description: 'Climate-controlled indoor court, great for year-round 7v7 sessions.',
    gameFormat: '7vs7',
  },
  {
    id: 3,
    name: 'Indoor Court Premium',
    location: 'Athens',
    type: 'Football',
    surface: 'Artificial Turf',
    status: 'Maintenance',
    environment: 'Outdoor',
    price: 60,
    currency: '€',
    rating: 4.8,
    reviews: 89,
    bookings: 89,
    revenue: '€11,980',
    description: 'Our flagship premium court with professional-grade turf and seating for spectators.',
    gameFormat: '11vs11',
  },
  {
    id: 4,
    name: 'Skyline Tennis Court',
    location: 'Athens',
    type: 'Football',
    surface: 'Artificial Turf',
    status: 'Active',
    environment: 'Indoor',
    price: 35,
    currency: '€',
    rating: 4.6,
    reviews: 56,
    bookings: 56,
    revenue: '€6,440',
    description: 'A compact indoor court well suited to 5v5 games and youth training sessions.',
    gameFormat: '5vs5',
  },
  {
    id: 5,
    name: 'Rooftop Futsal',
    location: 'Athens',
    type: 'Football',
    surface: 'Artificial Turf',
    status: 'Active',
    environment: 'Both',
    price: 40,
    currency: '€',
    rating: 4.5,
    reviews: 72,
    bookings: 72,
    revenue: '€8,640',
    description: 'A versatile rooftop court usable both indoors and outdoors depending on weather.',
    gameFormat: '6vs6',
  },
];

export function getCourtById(id: number): Court | undefined {
  return mockCourts.find((court) => court.id === id);
}