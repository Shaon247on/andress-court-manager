export type BookingType =
  | "match"
  | "lesson"
  | "maintenance"
  | "event"
  | "regular";

export interface Player {
  id: string;
  name: string;
  price: number;
  paymentMethod: string;
  isPaid: boolean;
}

export interface Booking {
  id: string;
  courtId: string;
  title: string;
  subtitle?: string;
  type: BookingType;
  startTime: number; // Unix timestamp or formatted string, let's use parsed times (hour as decimal e.g. 6.5 for 06:30)
  endTime: number;
  date: string; // YYYY-MM-DD
  paymentStatus?: "Paid" | "Unpaid" | "Partial";
  teamA?: { owner: string; players: Player[] };
  teamB?: { owner: string; players: Player[] };
}

// Temporary Mock Data
let mockBookings: Booking[] = [
  {
    id: "1",
    courtId: "court-1",
    title: "John Doe",
    subtitle: "06:00 - 07:00",
    type: "regular",
    startTime: 6,
    endTime: 7,
    date: "2026-04-03",
  },
  {
    id: "2",
    courtId: "court-2",
    title: "Jane Smith",
    subtitle: "07:00 - 08:30",
    type: "regular",
    startTime: 7,
    endTime: 8.5,
    date: "2026-04-03",
  },
  {
    id: "3",
    courtId: "court-3",
    title: "John Doe",
    subtitle: "08:00 - 09:00",
    type: "regular",
    startTime: 8,
    endTime: 9,
    date: "2026-04-03",
  },
  {
    id: "4",
    courtId: "court-1",
    title: "Sarah Williams",
    subtitle: "09:00 - 10:00\nLesson",
    type: "lesson",
    startTime: 9,
    endTime: 10,
    date: "2026-04-03",
    paymentStatus: "Paid",
  },
  {
    id: "5",
    courtId: "court-2",
    title: "Minnah Ali",
    subtitle: "09:00 - 10:00\nLesson",
    type: "lesson",
    startTime: 9,
    endTime: 10,
    date: "2026-04-03",
  },
  {
    id: "6",
    courtId: "court-3",
    title: "Mohammad",
    subtitle: "09:00 - 10:00\nLesson",
    type: "lesson",
    startTime: 9,
    endTime: 10,
    date: "2026-04-03",
  },
];

export async function fetchSchedule(date: string): Promise<Booking[]> {
  // simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockBookings.filter((b) => b.date === date);
}

export async function createBooking(data: Partial<Booking>): Promise<Booking> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const newBooking: Booking = {
    id: Math.random().toString(36).substr(2, 9),
    ...data,
  } as Booking;
  mockBookings.push(newBooking);
  return newBooking;
}

export async function cancelBooking(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  mockBookings = mockBookings.filter((b) => b.id !== id);
  return true;
}

export async function updateBooking(
  id: string,
  updates: Partial<Booking>,
): Promise<Booking> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  let updatedBooking: Booking | null = null;
  mockBookings = mockBookings.map((b) => {
    if (b.id === id) {
      updatedBooking = { ...b, ...updates };
      return updatedBooking;
    }
    return b;
  });
  if (!updatedBooking) throw new Error("Booking not found");
  return updatedBooking;
}

/**
 * API Integration Scope
 * This file serves as a central hub for all API calls in the application.
 * Replace the dummy implementations with actual fetch calls or SDK interactions.
 */

// User Authentication
export const login = async (credentials: any) => {
  console.log("API: login", credentials);
  return { token: "dummy_token", user: { name: "Andreas", role: "admin" } };
};

export const resetPassword = async (email: string) => {
  console.log("API: resetPassword", email);
  return { success: true };
};

// Dashboard Data
export const getDashboardStats = async () => {
  console.log("API: getDashboardStats");
  return {
    totalUsers: 12543,
    totalRevenue: 12543,
    pendingRequests: 43,
    activeBookings: 8240,
  };
};

export const getBookingTrend = async () => {
  console.log("API: getBookingTrend");
  return [
    { name: "Mon", value: 8 },
    { name: "Tue", value: 12 },
    { name: "Wed", value: 10 },
    { name: "Thu", value: 15 },
    { name: "Fri", value: 18 },
    { name: "Sat", value: 22 },
    { name: "Sun", value: 20 },
  ];
};

export const getCourtUtilization = async () => {
  console.log("API: getCourtUtilization");
  return [
    { name: "Arena Pro", percentage: 85 },
    { name: "Gemna Silva", percentage: 72 },
    { name: "Stadium Pro", percentage: 68 },
    { name: "Flora Stadium", percentage: 91 },
  ];
};

export const getTodaysBookings = async () => {
  console.log("API: getTodaysBookings");
  return [
    {
      id: 1,
      court: "Court A - Elite Sports",
      courtName: "Court D",
      time: "09:00 AM",
      customer: "John Smith",
      status: "Confirmed",
    },
    {
      id: 2,
      court: "Court B - Downtown Courts",
      courtName: "Court A",
      time: "10:30 AM",
      customer: "Emily Davis",
      status: "Confirmed",
    },
    {
      id: 3,
      court: "Court C - Riverside Arena",
      courtName: "Court D",
      time: "02:00 PM",
      customer: "Michael Brown",
      status: "Pending",
    },
    {
      id: 4,
      court: "Court A - Elite Sports",
      courtName: "Court C",
      time: "04:00 PM",
      customer: "Sarah Wilson",
      status: "Confirmed",
    },
    {
      id: 5,
      court: "Court D - City Sports Hub",
      courtName: "Court B",
      time: "06:30 PM",
      customer: "David Lee",
      status: "Confirmed",
    },
  ];
};
