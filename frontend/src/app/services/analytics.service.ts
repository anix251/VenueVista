import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Analytics } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:8080/api/analytics';

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<Analytics> {
    return this.http.get<Analytics>(this.apiUrl);
  }
}

