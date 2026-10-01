import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seat } from '../models/seat.model';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getSeatsByVenue(venueId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.baseUrl}/venues/${venueId}/seats`);
  }

  getAvailableSeats(venueId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.baseUrl}/venues/${venueId}/seats/available`);
  }

  createSeat(seat: Seat): Observable<Seat> {
    return this.http.post<Seat>(`${this.baseUrl}/seats`, seat);
  }

  updateSeatAvailability(id: number, available: boolean): Observable<Seat> {
    return this.http.put<Seat>(`${this.baseUrl}/seats/${id}`, { available });
  }
}

