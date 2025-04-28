import { inject, Injectable } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CryptService } from './crypt.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly firestore = inject(Firestore);
  private readonly cryptService = inject(CryptService);
  private readonly auth = inject(Auth);
  private readonly user$ = user(this.auth);

  constructor() { }

  async isUserProfessional(username: string): Promise<boolean> {
    const docRef = doc(this.firestore, "professionals", username);
    return !!(await getDoc(docRef)).data();
  }

  getUserObservable(): Observable<User | null> {
    return this.user$;
  }

  logAuth(user: User, isProfessional: boolean) {
    const now = new Date();
    let userDocument;
    let value;
    if (!user?.email) return;
    if (isProfessional) {
      userDocument = doc(this.firestore, `professionals/${user.email}`);
      value = { lastLogin: now };
    } else {
      userDocument = doc(this.firestore, `patients/${user.uid}`);
      value = { email: this.cryptService.encryptString(user.email), lastLogin: now };
    }
    return setDoc(userDocument, value, { merge: true });
  }

}
