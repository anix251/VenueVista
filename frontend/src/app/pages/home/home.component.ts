import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { VenueService } from '../../services/venue.service';
import { Event } from '../../models/event.model';
import { Venue } from '../../models/venue.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="home-container">
      
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-content">
          <h1 class="hero-title">Find events worth attending.</h1>
          <p class="hero-subtitle">Discover upcoming events, choose your seats and book your tickets in a few simple steps.</p>
          
          <div class="search-box">
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              placeholder="Search events, artists or venues..." 
              class="search-input"
            />
            <button class="btn-primary search-btn">Search</button>
          </div>
        </div>
      </section>

      <!-- Events List Section -->
      <section class="events-section">
        <div class="container">
          <h2 class="section-title">Upcoming Events</h2>
          
          <div *ngIf="loading" class="state-message">
            <p>Loading available events...</p>
          </div>

          <div *ngIf="!loading && filteredEvents.length === 0" class="state-message">
            <h3>No events found matching your search.</h3>
          </div>

          <div *ngIf="!loading && filteredEvents.length > 0" class="event-grid">
            
            <div *ngFor="let event of filteredEvents" class="event-card">
              <div class="card-image">
                <img [src]="event.imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'" alt="Event Image" />
                <span class="card-category">{{ event.category || 'EVENT' }}</span>
              </div>
              
              <div class="card-body">
                <h3 class="card-title">{{ event.name }}</h3>
                <div class="card-date">
                  {{ event.eventDate }} &bull; {{ event.eventTime }}
                </div>
                
                <div class="card-location">
                  <span class="venue-name">{{ event.venueName || 'Venue ID: ' + event.venueId }}</span>
                  <span class="city-name" *ngIf="event.location">{{ event.location }}</span>
                </div>
                
                <div class="card-footer">
                  <div class="card-price">
                    <span class="price-label">From</span>
                    <span class="price-amount">₹{{ event.price }}</span>
                  </div>
                  <a [routerLink]="['/events', event.id]" class="btn-accent btn-sm">View Details →</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      background-color: var(--bg-color);
      min-height: 100vh;
    }

    /* Hero Section */
    .hero-section {
      background-color: #ffffff;
      padding: 80px 0;
      border-bottom: 1px solid var(--border-color);
    }
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    .hero-title {
      font-size: 42px;
      font-weight: 800;
      color: var(--primary-color);
      margin-bottom: 16px;
      letter-spacing: -1px;
    }
    .hero-subtitle {
      font-size: 18px;
      color: var(--text-muted);
      margin-bottom: 32px;
    }
    
    .search-box {
      display: flex;
      gap: 12px;
      max-width: 600px;
      margin: 0 auto;
    }
    .search-input {
      flex: 1;
      height: 48px;
      padding: 0 16px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: 16px;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input:focus {
      border-color: var(--primary-color);
    }
    .search-btn {
      height: 48px;
      padding: 0 24px;
      font-size: 16px;
    }

    /* Events Section */
    .events-section {
      padding: 64px 0;
    }
    .section-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 32px;
      color: var(--text-main);
    }
    
    .state-message {
      text-align: center;
      padding: 48px 0;
      color: var(--text-muted);
    }

    /* Event Grid */
    .event-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .event-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
    }
    .event-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .card-image {
      position: relative;
      height: 160px;
      width: 100%;
      background-color: #e2e8f0;
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-category {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .card-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text-main);
      line-height: 1.3;
    }
    
    .card-date {
      font-size: 14px;
      font-weight: 600;
      color: var(--accent-color);
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    
    .card-location {
      display: flex;
      flex-direction: column;
      margin-bottom: 24px;
      flex: 1;
    }
    .venue-name {
      font-size: 14px;
      color: var(--text-main);
      font-weight: 500;
    }
    .city-name {
      font-size: 13px;
      color: var(--text-muted);
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }
    .card-price {
      display: flex;
      flex-direction: column;
    }
    .price-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    .price-amount {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-main);
    }
    .btn-sm {
      padding: 8px 12px;
      font-size: 13px;
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 32px; }
      .search-box { flex-direction: column; }
    }
  `]
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  venues: Venue[] = [];
  searchQuery: string = '';
  loading: boolean = true;

  constructor(private eventService: EventService, private venueService: VenueService) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.venueService.getAllVenues().subscribe({
      next: (vData) => {
        this.venues = vData;
        this.eventService.getAllEvents().subscribe({
          next: (eData) => {
            this.events = eData.map(e => {
              const v = this.venues.find(venue => venue.id === e.venueId);
              if (v) {
                e.venueName = v.name;
                e.location = v.location;
              }
              return e;
            });
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading events:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading venues:', err);
        this.loading = false;
      }
    });
  }

  get filteredEvents(): Event[] {
    return this.events.filter(e => {
      const q = this.searchQuery.toLowerCase();
      const matchName = e.name.toLowerCase().includes(q);
      const matchVenue = e.venueName ? e.venueName.toLowerCase().includes(q) : false;
      const matchLocation = e.location ? e.location.toLowerCase().includes(q) : false;
      return matchName || matchVenue || matchLocation;
    });
  }
}
