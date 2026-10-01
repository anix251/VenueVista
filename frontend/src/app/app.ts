import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-layout">
      <app-navbar *ngIf="!isAdminRoute"></app-navbar>
      <main class="main-content" [class.admin-main]="isAdminRoute">
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer" *ngIf="!isAdminRoute">
        <div class="container footer-container">
          <p>© 2026 VenueVista. Event Ticketing Platform.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
    }
    .admin-main {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .app-footer {
      background: #ffffff;
      border-top: 1px solid var(--border-color);
      padding: 24px 0;
      text-align: center;
      margin-top: auto;
    }
    .footer-container p {
      color: var(--text-muted);
      font-size: 14px;
    }
  `]
})
export class App {
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
    });
  }
}
