import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (!authService.isLoggedIn()) { //TODO this is not working in case of page refresh while logged in
    const loginPath = router.parseUrl("/login");
    return new RedirectCommand(loginPath);
  }
  return true;
};
