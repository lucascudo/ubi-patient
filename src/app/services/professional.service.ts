import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { AccessService } from './access.service';
import { AccessLog } from '../interfaces/access-log';

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
  private patientRef: any;

  constructor() {
    super();
    this.professionalCollection = collection(this.firestore, 'professionals');
    this.userService.getUserObservable().subscribe(user => {
      if (!user?.email) return;
      this.userId = user.uid;
      this.email = user.email;
      this.ready = true;
      this.patientRef = doc(this.firestore, `patients/${user.uid}`)
    });
  }

  isReady() {
    return this.ready;
  }

  getPatientRef() {
    return this.patientRef;
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

  async updateUnreadLogs() {
    const patientData: any = (await getDoc(this.patientRef))?.data();
    if (!patientData) return [];
    const logs = patientData['accesses'] || [];
    const accesses = logs.map((log: AccessLog) => {
      if (!log.viewedAt) {
        log.viewedAt = this.cryptService.encryptString((new Date()).toISOString().slice(0, 16));
      }
      return log;
    });
    return updateDoc(this.patientRef, {
      accesses
    });
  }
}
