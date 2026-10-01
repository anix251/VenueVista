import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRequest, BookingResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createBooking(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.baseUrl}/bookings`, request);
  }

  getAllBookings(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.baseUrl}/bookings`);
  }

  getBookingById(id: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.baseUrl}/bookings/${id}`);
  }

  getBookingsByUser(userId: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.baseUrl}/users/${userId}/bookings`);
  }

  cancelBooking(id: number): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.baseUrl}/bookings/${id}/cancel`, {});
  }
}

