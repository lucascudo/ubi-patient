import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { authState } from '../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom, map } from 'rxjs';
import { UserService } from '../services/user.service';

export const loginGuard: CanActivateFn = async (next: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const userService = inject(UserService);
  const _authState = authState(auth);
  const username = await firstValueFrom(_authState.pipe(map(u => u?.email)));
  if (!username) {
    return true;
  }
  const isUserProfessional = await userService.isUserProfessional(username);
  const homePath = router.parseUrl(`/home-${ isUserProfessional ? "professional" : "patient" }`);
  return new RedirectCommand(homePath);
};
