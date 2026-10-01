export interface Seat {
  id?: number;
  seatNumber: string;
  rowNumber: string;
  seatType: 'REGULAR' | 'PREMIUM' | string;
  price: number;
  available: boolean;
  venueId: number;
}

