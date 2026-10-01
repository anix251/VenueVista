import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { SeatSelectionComponent } from './pages/seat-selection/seat-selection.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'events/:id', component: EventDetailsComponent },
  { path: 'events/:id/seats', component: SeatSelectionComponent, canActivate: [authGuard] },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];

