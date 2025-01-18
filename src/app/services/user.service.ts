import { inject, Injectable } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly user$ = user(this.auth);

  constructor() { }

  async isUserProfessional(username: string): Promise<boolean> {
    const docRef = doc(this.firestore, "professionals", username);
    return !!(await getDoc(docRef)).data();
  }

  getUser(): Promise<User | null> {
    return firstValueFrom(this.user$);
  }
}
