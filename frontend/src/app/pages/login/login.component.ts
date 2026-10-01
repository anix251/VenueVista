import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-box">
        <h1 class="auth-title">Log In</h1>
        <p class="auth-subtitle">Welcome back to VenueVista</p>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              class="form-control" 
              [(ngModel)]="email" 
              required
              placeholder="you@example.com"
            >
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              class="form-control" 
              [(ngModel)]="password" 
              required
            >
          </div>
          
          <div *ngIf="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-primary auth-submit" [disabled]="!loginForm.form.valid || isLoading">
            {{ isLoading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/signup" class="text-link">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 72px);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-color);
      padding: 40px 20px;
    }
    .auth-box {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: var(--shadow-sm);
    }
    .auth-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 8px;
      text-align: center;
    }
    .auth-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      text-align: center;
      margin-bottom: 32px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 8px;
    }
    .form-control {
      width: 100%;
      height: 44px;
      padding: 0 12px;
      border: 1px solid #d6d9df;
      border-radius: var(--radius-md);
      font-size: 14px;
      color: var(--text-main);
      background: #ffffff;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .auth-submit {
      width: 100%;
      height: 44px;
      font-size: 15px;
      margin-top: 12px;
    }
    
    .error-alert {
      background: #fee2e2;
      color: #b91c1c;
      padding: 12px;
      border-radius: var(--radius-md);
      font-size: 13px;
      margin-bottom: 20px;
      border: 1px solid #f87171;
    }
    
    .auth-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 14px;
      color: var(--text-muted);
    }
    .text-link {
      color: var(--primary-color);
      font-weight: 600;
      text-decoration: none;
    }
    .text-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    this.userService.login({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}
