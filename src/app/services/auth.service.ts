import { Injectable, inject } from '@angular/core';
import { Auth, signOut, User } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, UserCredential } from "firebase/auth";
import { ɵzoneWrap } from "@angular/fire";
import { UserService } from './user.service';
import { Router } from '@angular/router';


function _authState(auth: Auth): Observable<User|null> {
  return from(auth.authStateReady()).pipe(
    switchMap(() => new Observable<User|null>((subscriber) => {
      const unsubscribe = onAuthStateChanged(
          auth,
          subscriber.next.bind(subscriber),
          subscriber.error.bind(subscriber),
          subscriber.complete.bind(subscriber),
      );
      return {unsubscribe};
    }))
  );
}

export const authState = ɵzoneWrap(_authState, true);

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth = inject(Auth);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  protected readonly authState = authState(this.auth);
  
  constructor() {}

  isLoggedIn() {
    return !!this.auth.currentUser;
  }

  logInWithGoogle() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then(this.afterLogin);
  }

  logInWithEmailAndPassword(email: string, password: string, errorHandler: (reason: any) => void) {
    signInWithEmailAndPassword(this.auth, email, password).then(this.afterLogin).catch(errorHandler);
  }

  createUser(email: string, password: string, errorHandler: (reason: any) => void) {
    createUserWithEmailAndPassword(this.auth, email, password).then(this.afterLogin).catch(errorHandler);
  }

  afterLogin = async ({ user }: UserCredential) => {
    if (!user.email) return;
    const isProfessional = await this.userService.isUserProfessional(user.email);
    this.userService.logAuth(user, isProfessional);
    this.router.navigateByUrl(`/home-${ isProfessional ? "professional" : "patient" }`);
  }

  logout() {
    return signOut(this.auth);
  }
}
