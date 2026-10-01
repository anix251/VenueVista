import { Seat } from './seat.model';

export interface BookingRequest {
  userId: number;
  eventId: number;
  seatIds: number[];
}

export interface BookingResponse {
  bookingId: number;
  bookingDate: string;
  totalAmount: number;
  status: 'CONFIRMED' | 'CANCELLED' | string;
  userId: number;
  userName: string;
  eventId: number;
  eventName: string;
  venueName: string;
  seats: Seat[];
}

