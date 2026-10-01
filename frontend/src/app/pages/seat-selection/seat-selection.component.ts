import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import { SeatService } from '../../services/seat.service';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { Seat } from '../../models/seat.model';
import { Event } from '../../models/event.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      
      <div class="container" *ngIf="loading">
        <div class="state-message">
          <p>Loading seating chart...</p>
        </div>
      </div>

      <div class="container" *ngIf="!loading && event">
        
        <div class="breadcrumb">
          <a [routerLink]="['/events', event.id]" class="back-link">← Back to Event Details</a>
        </div>

        <div class="seat-layout-wrapper">
          
          <!-- Left: Seating Chart -->
          <div class="seating-area">
            <h1 class="page-title">Select Your Seats</h1>
            
            <div class="legend">
              <div class="legend-item"><span class="legend-box available"></span> Standard</div>
              <div class="legend-item"><span class="legend-box premium"></span> Premium</div>
              <div class="legend-item"><span class="legend-box selected"></span> Selected</div>
              <div class="legend-item"><span class="legend-box booked"></span> Booked</div>
            </div>

            <div class="screen-indicator">
              <div class="screen-text">SCREEN / STAGE</div>
              <div class="screen-line"></div>
            </div>

            <div class="seat-grid">
              <ng-container *ngFor="let row of rows">
                <div class="seat-row">
                  <div class="row-label">{{ row }}</div>
                  
                  <div class="seats">
                    <button 
                      *ngFor="let seat of getSeatsByRow(row)" 
                      class="seat-btn"
                      [class.available]="seat.seatType !== 'PREMIUM' && seat.available && !isSelected(seat.id!)"
                      [class.premium]="seat.seatType === 'PREMIUM' && seat.available && !isSelected(seat.id!)"
                      [class.selected]="isSelected(seat.id!)"
                      [class.booked]="!seat.available"
                      [disabled]="!seat.available"
                      (click)="toggleSeat(seat)"
                      [title]="seat.seatNumber + ' - ' + seat.seatType + ' (₹' + seat.price + ')'"
                    >
                      <span class="sr-only">{{ seat.seatNumber }}</span>
                    </button>
                  </div>
                  
                  <div class="row-label right">{{ row }}</div>
                </div>
              </ng-container>
            </div>
            
            <div class="seat-type-info">
              <p>Standard Seats: ₹{{ event.price }}</p>
              <p>Premium Seats: ₹{{ event.price + 100 }}</p>
            </div>
          </div>
          
          <!-- Right: Summary Panel -->
          <div class="summary-panel">
            <div class="summary-card">
              <h2>Booking Summary</h2>
              
              <div class="event-brief">
                <div class="event-title">{{ event.name }}</div>
                <div class="event-meta">{{ event.eventDate }} &bull; {{ event.eventTime }}</div>
                <div class="event-meta">{{ event.venueName || 'Venue ID: ' + event.venueId }}</div>
              </div>
              
              <div class="divider"></div>
              
              <div class="selection-details">
                <div class="section-label">Selected Seats ({{ selectedSeats.length }})</div>
                
                <div *ngIf="selectedSeats.length === 0" class="empty-selection">
                  No seats selected yet.
                </div>
                
                <div class="selected-list" *ngIf="selectedSeats.length > 0">
                  <div *ngFor="let seat of selectedSeats" class="selected-item">
                    <span>{{ seat.seatNumber }} ({{ seat.seatType }})</span>
                    <span>₹{{ seat.price }}</span>
                  </div>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <div class="total-row">
                <span>Total Amount</span>
                <span class="total-price">₹{{ getTotalAmount() }}</span>
              </div>
              
              <div class="error-message" *ngIf="errorMessage">
                ⚠️ {{ errorMessage }}
              </div>
              
              <button 
                class="btn-primary btn-block" 
                [disabled]="selectedSeats.length === 0 || isBooking"
                (click)="confirmBooking()"
              >
                {{ isBooking ? 'Processing...' : 'Confirm Booking' }}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 32px 0 80px 0;
    }
    .state-message {
      text-align: center;
      padding: 64px 0;
      color: var(--text-muted);
    }
    
    .breadcrumb {
      margin-bottom: 24px;
    }
    .back-link {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }
    .back-link:hover {
      color: var(--primary-color);
      text-decoration: underline;
    }
    
    .seat-layout-wrapper {
      display: grid;
      grid-template-columns: 2.5fr 1fr;
      gap: 40px;
      align-items: start;
    }
    
    /* Seating Area */
    .seating-area {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .page-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
      text-align: center;
    }
    
    .legend {
      display: flex;
      gap: 24px;
      margin-bottom: 40px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted);
    }
    .legend-box {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }
    
    .screen-indicator {
      width: 100%;
      max-width: 500px;
      margin-bottom: 48px;
      text-align: center;
    }
    .screen-text {
      font-size: 12px;
      color: var(--text-muted);
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .screen-line {
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      width: 100%;
      box-shadow: 0 4px 10px -2px rgba(0,0,0,0.05);
    }
    
    .seat-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 40px;
    }
    .seat-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .row-label {
      width: 24px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      text-align: right;
    }
    .row-label.right {
      text-align: left;
    }
    
    .seats {
      display: flex;
      gap: 8px;
    }
    .seat-btn {
      width: 28px;
      height: 28px;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
      position: relative;
    }
    
    /* Seat Colors */
    .seat-btn.available, .legend-box.available {
      background-color: #f1f5f9;
      border-color: #cbd5e1;
    }
    .seat-btn.available:hover {
      background-color: #e2e8f0;
      border-color: #94a3b8;
    }
    
    .seat-btn.premium, .legend-box.premium {
      background-color: #fef3c7;
      border-color: #fcd34d;
    }
    .seat-btn.premium:hover {
      background-color: #fde68a;
      border-color: #fbbf24;
    }
    
    .seat-btn.selected, .legend-box.selected {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
    
    .seat-btn.booked, .legend-box.booked {
      background-color: #e2e8f0;
      border-color: #cbd5e1;
      cursor: not-allowed;
      opacity: 0.5;
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    .seat-type-info {
      font-size: 13px;
      color: var(--text-muted);
      display: flex;
      gap: 24px;
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
      width: 100%;
      justify-content: center;
    }
    
    /* Summary Panel */
    .summary-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 24px;
      position: sticky;
      top: 100px;
    }
    
    .summary-card h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .event-brief {
      margin-bottom: 20px;
    }
    .event-title {
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 4px;
    }
    .event-meta {
      font-size: 13px;
      color: var(--text-muted);
    }
    
    .divider {
      height: 1px;
      background: var(--border-color);
      margin: 20px 0;
    }
    
    .section-label {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .empty-selection {
      font-size: 13px;
      color: var(--text-muted);
      font-style: italic;
    }
    
    .selected-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 200px;
      overflow-y: auto;
    }
    .selected-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: var(--text-main);
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      font-weight: 600;
      font-size: 16px;
    }
    .total-price {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-main);
    }
    
    .btn-block {
      width: 100%;
      padding: 14px;
      font-size: 16px;
    }
    
    .error-message {
      color: #dc2626;
      font-size: 13px;
      margin-bottom: 16px;
      padding: 8px;
      background: #fee2e2;
      border-radius: var(--radius-sm);
    }
    
    @media (max-width: 900px) {
      .seat-layout-wrapper {
        grid-template-columns: 1fr;
      }
      .seat-grid {
        overflow-x: auto;
        padding-bottom: 16px;
        width: 100%;
        align-items: flex-start;
      }
    }
  `]
})
export class SeatSelectionComponent implements OnInit {
  event: Event | null = null;
  seats: Seat[] = [];
  rows: string[] = [];
  selectedSeats: Seat[] = [];
  loading: boolean = true;
  isBooking: boolean = false;
  errorMessage: string = '';
  activeUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private venueService: VenueService,
    private seatService: SeatService,
    private bookingService: BookingService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.activeUser$.subscribe(user => this.activeUser = user);
    
    if (!this.activeUser) {
      this.router.navigate(['/login']);
      return;
    }

    const eventIdParam = this.route.snapshot.paramMap.get('id');
    if (eventIdParam) {
      const eventId = Number(eventIdParam);
      
      this.eventService.getEventById(eventId).subscribe({
        next: (eventData) => {
          this.event = eventData;
          
          // Fetch Venue Name for the summary panel
          if (this.event.venueId) {
             this.venueService.getVenueById(this.event.venueId).subscribe({
                next: (venue) => {
                  if (this.event) {
                    this.event.venueName = venue.name;
                    this.event.location = venue.location;
                  }
                },
                error: (err) => console.error(err)
             });
          }
          
          this.seatService.getSeatsByVenue(this.event.venueId).subscribe({
            next: (seatData) => {
              // Ensure seats have prices based on the event base price
              this.seats = seatData.map(s => ({
                ...s,
                price: s.seatType === 'PREMIUM' ? this.event!.price + 100 : this.event!.price
              }));
              
              // Extract unique row letters
              const uniqueRows = new Set<string>();
              this.seats.forEach(s => uniqueRows.add(s.rowNumber));
              this.rows = Array.from(uniqueRows).sort();
              
              this.loading = false;
            },
            error: (err) => {
              console.error('Error fetching seats', err);
              this.errorMessage = 'Could not load seating chart.';
              this.loading = false;
            }
          });
        },
        error: (err) => {
          console.error('Error fetching event details', err);
          this.errorMessage = 'Event not found.';
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.errorMessage = 'Invalid event ID.';
    }
  }

  getSeatsByRow(row: string): Seat[] {
    return this.seats.filter(s => s.rowNumber === row).sort((a, b) => {
      const numA = parseInt(a.seatNumber.replace(/[^\d]/g, ''));
      const numB = parseInt(b.seatNumber.replace(/[^\d]/g, ''));
      return numA - numB;
    });
  }

  isSelected(seatId: number): boolean {
    return this.selectedSeats.some(s => s.id === seatId);
  }

  toggleSeat(seat: Seat): void {
    if (!seat.available) return;
    
    if (this.isSelected(seat.id!)) {
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      if (this.selectedSeats.length >= 10) {
        this.errorMessage = 'You can select a maximum of 10 seats per booking.';
        return;
      }
      this.errorMessage = '';
      this.selectedSeats.push(seat);
    }
  }

  getTotalAmount(): number {
    return this.selectedSeats.reduce((total, seat) => total + (seat.price || 0), 0);
  }

  confirmBooking(): void {
    if (this.selectedSeats.length === 0 || !this.event || !this.activeUser) return;
    
    this.isBooking = true;
    this.errorMessage = '';
    
    const bookingReq = {
      userId: this.activeUser.id!,
      eventId: this.event.id!,
      seatIds: this.selectedSeats.map(s => s.id as number)
    };
    
    this.bookingService.createBooking(bookingReq).subscribe({
      next: (res) => {
        this.isBooking = false;
        this.router.navigate(['/my-bookings']);
      },
      error: (err) => {
        console.error('Error creating booking', err);
        this.isBooking = false;
        this.errorMessage = 'Failed to create booking. Seats might have just been taken by someone else.';
        
        // Refresh seats on failure
        this.ngOnInit();
      }
    });
  }
}
