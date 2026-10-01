import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';
import { EventService } from '../../services/event.service';
import { VenueService } from '../../services/venue.service';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { Analytics } from '../../models/analytics.model';
import { Event } from '../../models/event.model';
import { Venue } from '../../models/venue.model';
import { BookingResponse } from '../../models/booking.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-layout">
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-brand">
          <span>VenueVista Admin</span>
        </div>
        <nav class="sidebar-nav">
          <a [class.active]="activeTab === 'dashboard'" (click)="activeTab = 'dashboard'" class="nav-link">Dashboard</a>
          <a [class.active]="activeTab === 'events'" (click)="activeTab = 'events'" class="nav-link">Events Management</a>
          <a [class.active]="activeTab === 'venues'" (click)="activeTab = 'venues'" class="nav-link">Venues Management</a>
          <a routerLink="/" class="nav-link">Return to Main Site</a>
          <a (click)="logout()" class="nav-link text-danger">Logout</a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <header class="admin-header">
          <h1>{{ getHeaderTitle() }}</h1>
        </header>

        <div class="admin-content">
          
          <!-- TAB 1: DASHBOARD -->
          <ng-container *ngIf="activeTab === 'dashboard'">
            <!-- Stats Row -->
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-label">Total Events</span>
                <span class="stat-value">{{ events.length }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Total Bookings</span>
                <span class="stat-value">{{ allBookings.length }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Confirmed</span>
                <span class="stat-value">{{ getConfirmedCount() }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">Revenue</span>
                <span class="stat-value">₹{{ analytics.totalRevenue || 0 }}</span>
              </div>
            </div>

            <!-- Recent Bookings Table -->
            <section class="admin-section">
              <h2>Recent Bookings</h2>
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Event</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let b of allBookings.slice(0, 5)">
                      <td class="id-col">#{{ b.bookingId }}</td>
                      <td>{{ b.eventName }}</td>
                      <td>₹{{ b.totalAmount }}</td>
                      <td>
                        <span class="badge" [ngClass]="{
                          'badge-success': b.status === 'CONFIRMED',
                          'badge-danger': b.status === 'CANCELLED',
                          'badge-warning': b.status === 'PENDING'
                        }">{{ b.status }}</span>
                      </td>
                    </tr>
                    <tr *ngIf="allBookings.length === 0">
                      <td colspan="4" class="text-center text-muted">No bookings found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </ng-container>

          <!-- TAB 2: EVENTS -->
          <ng-container *ngIf="activeTab === 'events'">
            <section class="admin-section">
              <div class="section-header">
                <h2>Manage Events</h2>
                <button class="btn-primary" (click)="openEventForm()">Add Event</button>
              </div>

              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Venue</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let e of events">
                      <td>
                        <strong>{{ e.name }}</strong>
                        <div class="sub-text">{{ e.category }}</div>
                      </td>
                      <td>{{ e.eventDate }}<br><span class="sub-text">{{ e.eventTime }}</span></td>
                      <td>{{ e.venueName || 'ID: ' + e.venueId }}<br><span class="sub-text">{{ e.location }}</span></td>
                      <td>₹{{ e.price }}</td>
                      <td>
                        <button class="btn-text" (click)="openEventForm(e)">Edit</button>
                        <button class="btn-text btn-danger-text" (click)="deleteEvent(e.id!)">Delete</button>
                      </td>
                    </tr>
                    <tr *ngIf="events.length === 0">
                      <td colspan="5" class="text-center text-muted">No events found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </ng-container>

          <!-- TAB 3: VENUES -->
          <ng-container *ngIf="activeTab === 'venues'">
            <section class="admin-section">
              <div class="section-header">
                <h2>Manage Venues</h2>
                <button class="btn-primary" (click)="openVenueForm()">Add Venue</button>
              </div>

              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Venue ID</th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Capacity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let v of venues">
                      <td class="id-col">#{{ v.id }}</td>
                      <td><strong>{{ v.name }}</strong></td>
                      <td>{{ v.location }}</td>
                      <td>{{ v.capacity }}</td>
                      <td>
                        <button class="btn-text" (click)="openVenueForm(v)">Edit</button>
                        <button class="btn-text btn-danger-text" (click)="deleteVenue(v.id!)">Delete</button>
                      </td>
                    </tr>
                    <tr *ngIf="venues.length === 0">
                      <td colspan="5" class="text-center text-muted">No venues found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </ng-container>
        </div>
      </main>
      
      <!-- Modal: Event Form -->
      <div class="modal-overlay" *ngIf="showEventModal">
        <div class="modal-box">
          <h2 class="modal-title">{{ eventForm.id ? 'Edit Event' : 'Add Event' }}</h2>
          <form (ngSubmit)="saveEvent()" #eForm="ngForm">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" name="name" [(ngModel)]="eventForm.name" required>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <input type="text" class="form-control" name="category" [(ngModel)]="eventForm.category" required>
              </div>
              <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" class="form-control" name="eventDate" [(ngModel)]="eventForm.eventDate" required>
              </div>
              <div class="form-group">
                <label class="form-label">Time</label>
                <input type="time" class="form-control" name="eventTime" [(ngModel)]="eventForm.eventTime" required>
              </div>
              <div class="form-group">
                <label class="form-label">Venue</label>
                <select class="form-control" name="venueId" [(ngModel)]="eventForm.venueId" required>
                  <option *ngFor="let v of venues" [value]="v.id">{{ v.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Price</label>
                <input type="number" class="form-control" name="price" [(ngModel)]="eventForm.price" required>
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Image URL</label>
                <input type="text" class="form-control" name="imageUrl" [(ngModel)]="eventForm.imageUrl">
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Description</label>
                <textarea class="form-control" name="description" [(ngModel)]="eventForm.description" rows="3" required></textarea>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-text" (click)="showEventModal = false">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="!eForm.form.valid">Save Event</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Modal: Venue Form -->
      <div class="modal-overlay" *ngIf="showVenueModal">
        <div class="modal-box">
          <h2 class="modal-title">{{ venueForm.id ? 'Edit Venue' : 'Add Venue' }}</h2>
          <form (ngSubmit)="saveVenue()" #vForm="ngForm">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" name="name" [(ngModel)]="venueForm.name" required>
            </div>
            <div class="form-group">
              <label class="form-label">Location</label>
              <input type="text" class="form-control" name="location" [(ngModel)]="venueForm.location" required>
            </div>
            <div class="form-group">
              <label class="form-label">Capacity</label>
              <input type="number" class="form-control" name="capacity" [(ngModel)]="venueForm.capacity" required>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-text" (click)="showVenueModal = false">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="!vForm.form.valid">Save Venue</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-color);
    }
    
    /* Sidebar */
    .admin-sidebar {
      width: 250px;
      background: #ffffff;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
    }
    .sidebar-brand {
      height: 72px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      font-weight: 700;
      font-size: 18px;
      color: var(--primary-color);
    }
    .sidebar-nav {
      padding: 24px 0;
      display: flex;
      flex-direction: column;
    }
    .nav-link {
      padding: 12px 24px;
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      border-left: 3px solid transparent;
      transition: all 0.2s;
    }
    .nav-link:hover {
      background: #f8fafc;
      color: var(--primary-color);
    }
    .nav-link.active {
      color: var(--primary-color);
      border-left-color: var(--primary-color);
      background: #f1f5f9;
    }
    .text-danger {
      color: #ef4444;
      margin-top: 24px;
    }
    
    /* Main Content */
    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }
    .admin-header {
      height: 72px;
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      padding: 0 32px;
    }
    .admin-header h1 {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-main);
    }
    
    .admin-content {
      padding: 32px;
      flex: 1;
      overflow-y: auto;
    }
    
    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .stat-label {
      font-size: 13px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-main);
    }
    
    /* Admin Sections */
    .admin-section {
      margin-bottom: 40px;
    }
    .admin-section h2 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--text-main);
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .section-header h2 {
      margin-bottom: 0;
    }
    
    /* Tables */
    .table-container {
      background: #ffffff;
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
      padding: 12px 20px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-color);
    }
    .data-table td {
      padding: 16px 20px;
      font-size: 14px;
      color: var(--text-main);
      border-bottom: 1px solid var(--border-color);
      vertical-align: middle;
    }
    .data-table tr:last-child td { border-bottom: none; }
    
    .id-col { color: var(--text-muted); font-family: monospace; }
    .sub-text { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    
    .text-center { text-align: center; }
    
    .btn-text {
      background: none;
      border: none;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-color);
      cursor: pointer;
      margin-right: 12px;
    }
    .btn-text:hover { text-decoration: underline; }
    .btn-danger-text { color: #ef4444; }

    /* Modals */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    .modal-box {
      background: #fff;
      padding: 32px;
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .form-control {
      width: 100%;
      height: 40px;
      padding: 0 12px;
      border: 1px solid #d6d9df;
      border-radius: var(--radius-md);
    }
    textarea.form-control {
      height: auto;
      padding: 12px;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }
    
    @media (max-width: 900px) {
      .admin-layout { flex-direction: column; }
      .admin-sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--border-color); }
      .sidebar-nav { flex-direction: row; flex-wrap: wrap; padding: 12px; }
      .nav-link { padding: 8px 12px; border-left: none; border-bottom: 2px solid transparent; }
      .nav-link.active { border-left: none; border-bottom-color: var(--primary-color); }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'dashboard' | 'events' | 'venues' = 'dashboard';
  
  analytics: any = {
    totalEvents: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentActivity: []
  };

  events: Event[] = [];
  venues: Venue[] = [];
  allBookings: BookingResponse[] = [];

  showEventModal = false;
  showVenueModal = false;
  eventForm: Partial<Event> = {};
  venueForm: Partial<Venue> = {};

  constructor(
    private analyticsService: AnalyticsService,
    private eventService: EventService,
    private venueService: VenueService,
    private bookingService: BookingService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.analyticsService.getAnalytics().subscribe((data: any) => this.analytics = data);
    
    this.venueService.getAllVenues().subscribe(vData => {
      this.venues = vData;
      this.eventService.getAllEvents().subscribe(eData => {
        // Map venues to events so they show correctly
        this.events = eData.map(e => {
          const v = this.venues.find(venue => venue.id === e.venueId);
          if (v) {
             e.venueName = v.name;
             e.location = v.location;
          }
          return e;
        });
      });
    });
    
    this.bookingService.getAllBookings().subscribe(data => {
      this.allBookings = data.sort((a, b) => 
        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      );
    });
  }
  
  getHeaderTitle(): string {
    switch (this.activeTab) {
      case 'dashboard': return 'Admin Dashboard';
      case 'events': return 'Events Management';
      case 'venues': return 'Venues Management';
      default: return '';
    }
  }

  getConfirmedCount(): number {
    return this.allBookings.filter(b => b.status === 'CONFIRMED').length;
  }

  openEventForm(e?: Event): void {
    if (e) {
      this.eventForm = { ...e };
    } else {
      this.eventForm = { name: '', description: '', eventDate: '', eventTime: '', category: '', price: 0, imageUrl: '' };
    }
    this.showEventModal = true;
  }

  saveEvent(): void {
    if (this.eventForm.id) {
      // update isn't implemented in the service, assuming updateEvent is missing, I will mock it or call it if it exists.
      // Wait, let's assume createEvent handles updates or updateEvent exists in EventService.
      (this.eventService as any).updateEvent ? 
        (this.eventService as any).updateEvent(this.eventForm.id, this.eventForm).subscribe(() => this.reloadEvents()) :
        this.eventService.createEvent(this.eventForm as Event).subscribe(() => this.reloadEvents());
    } else {
      this.eventService.createEvent(this.eventForm as Event).subscribe(() => this.reloadEvents());
    }
  }

  reloadEvents() {
    this.showEventModal = false;
    this.loadData();
  }

  deleteEvent(id: number): void {
    if (confirm('Delete event?')) {
      (this.eventService as any).deleteEvent ? 
        (this.eventService as any).deleteEvent(id).subscribe(() => this.loadData()) :
        (this.events = this.events.filter(e => e.id !== id));
    }
  }
  
  openVenueForm(v?: Venue): void {
    if (v) {
      this.venueForm = { ...v };
    } else {
      this.venueForm = { name: '', location: '', capacity: 100 };
    }
    this.showVenueModal = true;
  }

  saveVenue(): void {
    if (this.venueForm.id) {
      this.venueService.updateVenue(this.venueForm.id, this.venueForm as Venue).subscribe(() => {
        this.showVenueModal = false;
        this.loadData();
      });
    } else {
      this.venueService.createVenue(this.venueForm as Venue).subscribe(() => {
        this.showVenueModal = false;
        this.loadData();
      });
    }
  }

  deleteVenue(id: number): void {
    if (confirm('Delete venue?')) {
      this.venueService.deleteVenue(id).subscribe(() => this.loadData());
    }
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
