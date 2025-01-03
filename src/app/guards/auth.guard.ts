import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { authState } from '../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom, map } from 'rxjs';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = async (next: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const userService = inject(UserService);
  const _authState = authState(auth);
  const username = await firstValueFrom(_authState.pipe(map(u => u?.email)));
  if (!username) {
    const loginPath = router.parseUrl("/login");
    return new RedirectCommand(loginPath);
  }
  if (next.data["role"]) {
    const isUserProfessional = await userService.isUserProfessional(username);
    if ((next.data["role"] == "professional") ? !isUserProfessional : isUserProfessional) {
      const homePath = router.parseUrl(`/home-${ isUserProfessional ? "professional" : "patient" }`);
      return new RedirectCommand(homePath);
    }
  }
  return true;
};
