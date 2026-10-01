import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  if (userService.getActiveUser()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

