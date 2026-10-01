import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venue } from '../models/venue.model';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private apiUrl = 'http://localhost:8080/api/venues';

  constructor(private http: HttpClient) {}

  getAllVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(this.apiUrl);
  }

  getVenueById(id: number): Observable<Venue> {
    return this.http.get<Venue>(`${this.apiUrl}/${id}`);
  }

  createVenue(venue: Venue): Observable<Venue> {
    return this.http.post<Venue>(this.apiUrl, venue);
  }

  updateVenue(id: number, venue: Venue): Observable<Venue> {
    return this.http.put<Venue>(`${this.apiUrl}/${id}`, venue);
  }

  deleteVenue(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

