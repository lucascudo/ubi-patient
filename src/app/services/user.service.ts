import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly firestore = inject(Firestore);

  constructor() { }

  async isUserProfessional(username: string): Promise<boolean> {
    const docRef = doc(this.firestore, "professionals", username);
    return !!(await getDoc(docRef)).data();
  }
}
