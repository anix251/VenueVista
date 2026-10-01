import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private activeUserSubject = new BehaviorSubject<User | null>(null);
  activeUser$ = this.activeUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('venuevista_user');
    if (savedUser) {
      this.activeUserSubject.next(JSON.parse(savedUser));
    }
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  login(credentials: any): Observable<User> {
    return new Observable(observer => {
      this.http.post<User>(`${this.apiUrl}/login`, credentials).subscribe({
        next: (user) => {
          this.setActiveUser(user);
          observer.next(user);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  register(user: User): Observable<User> {
    return new Observable(observer => {
      this.http.post<User>(this.apiUrl, user).subscribe({
        next: (newUser) => {
          this.setActiveUser(newUser);
          observer.next(newUser);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  logout(): void {
    localStorage.removeItem('venuevista_user');
    this.activeUserSubject.next(null);
  }

  setActiveUser(user: User): void {
    localStorage.setItem('venuevista_user', JSON.stringify(user));
    this.activeUserSubject.next(user);
  }

  getActiveUser(): User | null {
    return this.activeUserSubject.value;
  }
}

