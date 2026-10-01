import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingResponse } from '../../models/booking.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="container">
        
        <div class="page-header">
          <h1 class="page-title">My Bookings</h1>
        </div>

        <div *ngIf="loading" class="state-message">
          <p>Loading your bookings...</p>
        </div>

        <div *ngIf="!loading && bookings.length === 0" class="empty-state">
          <div class="empty-content">
            <h3>No Bookings Found</h3>
            <p>You haven't booked any events yet.</p>
            <a routerLink="/" class="btn-primary" style="margin-top: 16px;">Browse Events</a>
          </div>
        </div>

        <div *ngIf="!loading && bookings.length > 0" class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Event</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bookings">
                <td class="id-col">#{{ b.bookingId }}</td>
                <td class="event-col">
                  <strong>{{ b.eventName }}</strong>
                  <div class="sub-text">{{ b.venueName }}</div>
                </td>
                <td>{{ formatDate(b.bookingDate) }}</td>
                <td>{{ b.seats.length }} seat(s)</td>
                <td class="amount-col">₹{{ b.totalAmount }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-success': b.status === 'CONFIRMED',
                    'badge-danger': b.status === 'CANCELLED',
                    'badge-warning': b.status === 'PENDING'
                  }">
                    {{ b.status }}
                  </span>
                </td>
                <td class="action-col">
                  <button 
                    *ngIf="b.status === 'CONFIRMED'" 
                    class="btn-text btn-danger-text" 
                    (click)="cancelBooking(b.bookingId)"
                    [disabled]="cancellingId === b.bookingId"
                  >
                    {{ cancellingId === b.bookingId ? 'Cancelling...' : 'Cancel' }}
                  </button>
                  <span *ngIf="b.status !== 'CONFIRMED'" class="text-muted">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 40px 0;
    }
    .page-header {
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-main);
    }
    
    .state-message {
      text-align: center;
      padding: 64px 0;
      color: var(--text-muted);
    }
    
    .empty-state {
      background: var(--card-bg);
      border: 1px dashed var(--border-color);
      border-radius: var(--radius-lg);
      padding: 64px 24px;
      text-align: center;
    }
    .empty-content h3 {
      font-size: 20px;
      color: var(--text-main);
      margin-bottom: 8px;
    }
    .empty-content p {
      color: var(--text-muted);
    }
    
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th {
      background: #f8fafc;
      padding: 16px 20px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border-color);
    }
    .data-table td {
      padding: 16px 20px;
      font-size: 14px;
      color: var(--text-main);
      border-bottom: 1px solid var(--border-color);
      vertical-align: middle;
    }
    .data-table tr:last-child td {
      border-bottom: none;
    }
    .data-table tr:hover td {
      background: #f8fafc;
    }
    
    .id-col {
      color: var(--text-muted);
      font-family: monospace;
    }
    .event-col strong {
      font-weight: 600;
      color: var(--text-main);
    }
    .sub-text {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .amount-col {
      font-weight: 600;
    }
    
    .btn-text {
      background: none;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .btn-danger-text {
      color: #ef4444;
    }
    .btn-danger-text:hover {
      text-decoration: underline;
    }
    .btn-danger-text:disabled {
      color: #fca5a5;
      cursor: not-allowed;
      text-decoration: none;
    }
    .text-muted {
      color: var(--text-muted);
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading: boolean = true;
  cancellingId: number | null = null;

  constructor(
    private bookingService: BookingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.userService.activeUser$.subscribe(user => {
      if (user) {
        this.bookingService.getBookingsByUser(user.id!).subscribe({
          next: (data: BookingResponse[]) => {
            this.bookings = data.sort((a: BookingResponse, b: BookingResponse) => 
              new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
            );
            this.loading = false;
          },
          error: (err: any) => {
            console.error('Error fetching bookings', err);
            this.loading = false;
          }
        });
      }
    });
  }

  cancelBooking(bookingId: number): void {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      this.cancellingId = bookingId;
      this.bookingService.cancelBooking(bookingId).subscribe({
        next: (updatedBooking: BookingResponse) => {
          const index = this.bookings.findIndex(b => b.bookingId === bookingId);
          if (index !== -1) {
            this.bookings[index] = updatedBooking;
          }
          this.cancellingId = null;
        },
        error: (err: any) => {
          console.error('Error cancelling booking', err);
          alert('Failed to cancel booking. Please try again.');
          this.cancellingId = null;
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
