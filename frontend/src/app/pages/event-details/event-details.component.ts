import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { VenueService } from '../../services/venue.service';
import { Event } from '../../models/event.model';
import { Venue } from '../../models/venue.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="container" *ngIf="!event && !loading">
        <div class="state-message">
          <h2>Event not found</h2>
          <a routerLink="/" class="btn-primary">Return to Home</a>
        </div>
      </div>
      
      <div class="container" *ngIf="loading">
        <div class="state-message">
          <p>Loading event details...</p>
        </div>
      </div>

      <div class="container" *ngIf="event">
        
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <a routerLink="/" class="back-link">← Back to All Events</a>
        </div>

        <!-- Top Section: Image & Main Info -->
        <div class="event-hero">
          
          <div class="event-image-wrapper">
            <img [src]="event.imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'" alt="Event Image" class="event-image"/>
          </div>

          <div class="event-summary">
            <span class="category-badge">{{ event.category || 'EVENT' }}</span>
            <h1 class="event-title">{{ event.name }}</h1>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Date & Time</span>
                <span class="info-value">{{ event.eventDate }} &bull; {{ event.eventTime }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Venue</span>
                <span class="info-value">{{ event.venueName || 'Venue ID: ' + event.venueId }}</span>
              </div>
              
              <div class="info-item" *ngIf="event.location">
                <span class="info-label">Location</span>
                <span class="info-value">{{ event.location }}</span>
              </div>
            </div>

            <div class="booking-section">
              <div class="price-box">
                <span class="price-label">Starting from</span>
                <span class="price-amount">₹{{ event.price }}</span>
              </div>
              
              <a [routerLink]="['/events', event.id, 'seats']" class="btn-primary btn-large">
                Book Tickets
              </a>
            </div>
          </div>
          
        </div>

        <!-- Bottom Section: Details -->
        <div class="event-details">
          
          <div class="detail-section">
            <h2>About the Event</h2>
            <p class="description-text">{{ event.description }}</p>
          </div>
          
          <div class="detail-section" *ngIf="event.venueName">
            <h2>Venue Information</h2>
            <div class="venue-card">
              <h3>{{ event.venueName }}</h3>
              <p>{{ event.location }}</p>
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
    
    /* Top Hero Section */
    .event-hero {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 40px;
      margin-bottom: 48px;
    }
    
    .event-image-wrapper {
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: #e2e8f0;
    }
    .event-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      aspect-ratio: 16/9;
    }
    
    .event-summary {
      display: flex;
      flex-direction: column;
    }
    
    .category-badge {
      display: inline-block;
      background: #f1f5f9;
      color: var(--text-muted);
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 16px;
      width: fit-content;
    }
    
    .event-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.2;
      margin-bottom: 32px;
      letter-spacing: -0.5px;
    }
    
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .info-label {
      font-size: 13px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .info-value {
      font-size: 16px;
      color: var(--text-main);
      font-weight: 500;
    }
    
    .booking-section {
      margin-top: auto;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      padding: 24px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    
    .price-box {
      display: flex;
      flex-direction: column;
    }
    .price-label {
      font-size: 13px;
      color: var(--text-muted);
    }
    .price-amount {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-main);
    }
    
    .btn-large {
      padding: 14px 32px;
      font-size: 16px;
    }
    
    /* Bottom Details Section */
    .event-details {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 40px;
      border-top: 1px solid var(--border-color);
      padding-top: 48px;
    }
    
    .detail-section h2 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 16px;
    }
    .description-text {
      color: var(--text-main);
      line-height: 1.6;
      font-size: 16px;
      white-space: pre-line;
    }
    
    .venue-card {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      padding: 20px;
      border-radius: var(--radius-md);
    }
    .venue-card h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .venue-card p {
      color: var(--text-muted);
      font-size: 14px;
    }
    
    @media (max-width: 900px) {
      .event-hero {
        grid-template-columns: 1fr;
      }
      .event-details {
        grid-template-columns: 1fr;
      }
      .event-image-wrapper {
        aspect-ratio: auto;
        height: 300px;
      }
      .booking-section {
        flex-direction: column;
        align-items: stretch;
      }
      .btn-large {
        width: 100%;
      }
    }
  `]
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private venueService: VenueService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.eventService.getEventById(id).subscribe({
        next: (data) => {
          this.event = data;
          
          // Fetch venue details
          if (this.event.venueId) {
            this.venueService.getVenueById(this.event.venueId).subscribe({
              next: (venue) => {
                if (this.event) {
                  this.event.venueName = venue.name;
                  this.event.location = venue.location;
                }
                this.loading = false;
              },
              error: (err) => {
                console.error('Error fetching venue details', err);
                this.loading = false;
              }
            });
          } else {
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error fetching event details', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
}
