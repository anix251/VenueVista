export interface Event {
  id?: number;
  name: string;
  description: string;
  eventDate: string;
  eventTime: string;
  category: string;
  price: number;
  venueId: number;
  imageUrl?: string;
  venueName?: string;
  location?: string;
}
