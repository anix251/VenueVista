import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        
        <!-- Left: Logo -->
        <a routerLink="/" class="brand">
          <span class="brand-name">VenueVista</span>
        </a>

        <!-- Mobile Toggle -->
        <button class="mobile-toggle" (click)="mobileMenuOpen = !mobileMenuOpen">
          ☰
        </button>

        <!-- Center: Navigation Links -->
        <div class="nav-links" [class.open]="mobileMenuOpen">
          <ng-container *ngIf="activeUser?.role !== 'ADMIN'">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item" (click)="mobileMenuOpen = false">Events</a>
            <a *ngIf="activeUser" routerLink="/my-bookings" routerLinkActive="active" class="nav-item" (click)="mobileMenuOpen = false">My Bookings</a>
          </ng-container>
          <ng-container *ngIf="activeUser?.role === 'ADMIN'">
            <a routerLink="/admin" routerLinkActive="active" class="nav-item" (click)="mobileMenuOpen = false">Admin Dashboard</a>
          </ng-container>
          
          <!-- Auth items in mobile menu -->
          <div class="mobile-auth" *ngIf="mobileMenuOpen">
            <ng-container *ngIf="!activeUser">
              <a routerLink="/login" class="nav-item" (click)="mobileMenuOpen = false">Login</a>
              <a routerLink="/signup" class="nav-item" (click)="mobileMenuOpen = false">Sign Up</a>
            </ng-container>
            <ng-container *ngIf="activeUser">
              <a class="nav-item" (click)="logout(); mobileMenuOpen = false">Logout ({{activeUser.name}})</a>
            </ng-container>
          </div>
        </div>

        <!-- Right: Auth & Actions (Desktop) -->
        <div class="auth-section">
          <!-- Search Icon Placeholder (Desktop) -->
          <button class="icon-btn" title="Search">🔍</button>
          
          <ng-container *ngIf="!activeUser">
            <a routerLink="/login" class="btn-text">Login</a>
            <a routerLink="/signup" class="btn-primary">Sign Up</a>
          </ng-container>
          
          <ng-container *ngIf="activeUser">
            <div class="user-menu">
              <span class="user-name">👤 {{ activeUser.name }}</span>
              <button (click)="logout()" class="btn-text btn-logout">Logout</button>
            </div>
          </ng-container>
        </div>

      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 72px;
      display: flex;
      align-items: center;
    }
    .nav-container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .brand {
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    .brand-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-color);
      letter-spacing: -0.5px;
    }
    
    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;
    }
    .nav-item {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      padding: 24px 0; /* Full height for bottom border */
      border-bottom: 2px solid transparent;
      transition: color 0.2s, border-color 0.2s;
    }
    .nav-item:hover {
      color: var(--primary-color);
    }
    .nav-item.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    
    .auth-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .icon-btn {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: var(--text-muted);
      padding: 8px;
    }
    .icon-btn:hover {
      color: var(--primary-color);
    }
    
    .btn-text {
      background: none;
      border: none;
      color: var(--text-main);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .btn-text:hover {
      color: var(--primary-color);
    }
    
    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-main);
    }
    .btn-logout {
      color: var(--text-muted);
    }
    .btn-logout:hover {
      color: #ef4444;
    }

    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--primary-color);
    }
    .mobile-auth {
      display: none;
    }

    @media (max-width: 768px) {
      .mobile-toggle {
        display: block;
      }
      .nav-links {
        display: none;
        position: absolute;
        top: 72px;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        gap: 0;
        border-bottom: 1px solid var(--border-color);
        box-shadow: var(--shadow-sm);
      }
      .nav-links.open {
        display: flex;
      }
      .nav-item {
        width: 100%;
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-color);
      }
      .nav-item.active {
        border-bottom-color: var(--border-color);
        background: #f8fafc;
      }
      .auth-section {
        display: none; /* Hide desktop auth on mobile */
      }
      .mobile-auth {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  activeUser: User | null = null;
  mobileMenuOpen = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.activeUser$.subscribe(user => this.activeUser = user);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
