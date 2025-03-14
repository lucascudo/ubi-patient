import { Injectable, inject } from '@angular/core';
import { Auth, signOut, User } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, beforeAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { ɵzoneWrap } from "@angular/fire";


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
  protected readonly authState = authState(this.auth);

  constructor() {}

  async logout() {
    return await signOut(this.auth);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  isLoggedIn() {
    return !!this.auth.currentUser;
  }
}
