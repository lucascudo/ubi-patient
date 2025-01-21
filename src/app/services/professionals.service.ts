import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, deleteField, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { CryptService } from './crypt.service';
import { Access } from '../interfaces/access';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalsService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private cryptService = inject(CryptService);
  private professionalCollection: any;
  private userId: string = '';
  private email: string = '';
  private ready = false;

  constructor() {
    this.professionalCollection = collection(this.firestore, 'professionals');
    this.userService.getUser().then(user => {
      if (!user?.email) return;
      this.userId = user.uid;
      this.email = user.email;
      this.ready = true;
    });
  }

  isReady() {
    return this.ready;
  }

  getProfessionals() {
    return collectionData(this.professionalCollection, { idField: 'id' });
  }

  createAccess(email: string) {
    const now = new Date();
    const access: Access = this.cryptService.encryptObject({
      id: this.userId,
      email: this.email,
      patientAcceptedAt: now.toISOString().slice(0, 16),
      professionalAcceptedAt: null,
      createdAt: now.toISOString().slice(0, 16),
      updatedAt: now.toISOString().slice(0, 16),
    });
    return setDoc(doc(this.firestore, `professionals/${email}`), {
      [access.id]: access,
      updatedAt: now,
    }, { merge: true });
  }
  
  updatedAcceptance(email: string, accepted: boolean) {
    const now = new Date();
    const access = this.cryptService.encryptObject({
      patientAcceptedAt: (accepted) ? now.toISOString().slice(0, 16) : null,
      updatedAt: now.toISOString().slice(0, 16),
    });
    return setDoc(doc(this.firestore, `professionals/${email}`), {
      [this.userId]: access,
      updatedAt: now,
    }, { merge: true });
  }

  deleteAccess(email: string, id: string) {
    updateDoc(doc(this.firestore, `professionals/${email}`), {
      [id]: deleteField(),
      updatedAt: new Date()
    });
  }
}
