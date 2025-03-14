import { inject, Injectable } from '@angular/core';
import { collection, collectionData } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { AccessService } from './access.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService extends AccessService {
  private userService = inject(UserService);
  private professionalCollection: any;
  private type = 'patient';
  private userId: string = '';
  private email: string = '';
  private ready = false;

  constructor() {
    super();
    this.professionalCollection = collection(this.firestore, 'professionals');
    this.userService.getUserObservable().subscribe(user => {
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
    return this._createAccess(email, this.email, this.userId, this.type);
  }
  
  updatedAcceptance(email: string, accepted: boolean) {
    return this._updatedAcceptance(email, this.userId, accepted, this.type);
  }

  deleteAccess(email: string) {
    return this._deleteAccess(email, this.userId);
  }
}
