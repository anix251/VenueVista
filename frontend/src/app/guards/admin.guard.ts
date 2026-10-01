import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const user = userService.getActiveUser();
  
  if (user && user.role === 'ADMIN') {
    return true;
  }
  
  router.navigate(['/']);
  return false;
};

