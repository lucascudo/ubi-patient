import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { AccessService } from './access.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService extends AccessService {
  private patientCollection = collectionData(collection(this.firestore, 'patients'), { idField: 'id' });
  private patients: any[] = [];
  private userService = inject(UserService);
  private professionalRef: any;
  private type = 'professional';
  private email: string = '';
  private ready = false;
  

  constructor() {
    super();
    this.patientCollection.subscribe(patients => this.patients = patients.map(p => this.cryptService.decryptObject(p)));
    this.userService.getUserObservable().subscribe(user => {
      if (!user?.email) return;
      this.professionalRef = doc(this.firestore, `professionals/${user.email}`);
      this.email = user.email;
      this.ready = true;
    });
  }

  isReady() {
    return this.ready;
  }

  getProfessionalRef() {
    return this.professionalRef;
  }

  exists(email: string) {
    return this.patients.map(p => p.email).includes(email);
  }

  createAccess(email: string) {
    const userId = this.patients.filter(p => p.email == email).map(p => p.id).pop();
    if (!userId) return;
    return this._createAccess(this.email, email, userId, this.type);
  }
  
  updatedAcceptance(userId: string, accepted: boolean) {
    return this._updatedAcceptance(this.email, userId, accepted, this.type);
  }

  deleteAccess(userId: string) {
    return this._deleteAccess(this.email, userId);
  }

  async logAccess(patientId: string, professionalEmail: string) {
    const timestamp = new Date().toISOString().slice(0, 16);
    const patientRef = doc(this.firestore, `patients/${patientId}`);
    const patientData = (await getDoc(patientRef))?.data();
    if (!patientData) return;
    let accesses = patientData['accesses'] || [];
    accesses.push(this.cryptService.encryptObject({ professionalEmail, timestamp }));
    return updateDoc(patientRef, {
      accesses
    });
  }

  getPatientsFromProfessional(professional: any) {
    const data = professional.data();
    const patients: any[] = [];
    for (let key of Object.keys(data).filter(k => !['updatedAt', 'lastLogin'].includes(k))) {
      patients.push(data[key]);
    }
    return patients;
  }
}
