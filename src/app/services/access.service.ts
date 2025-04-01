import { inject, Injectable } from '@angular/core';
import { deleteField, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { CryptService } from './crypt.service';
import { Access } from '../interfaces/access';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  protected cryptService = inject(CryptService);
  protected firestore = inject(Firestore);

  protected _deleteAccess(email: string, id: string) {
    return updateDoc(doc(this.firestore, `professionals/${email}`), {
      [id]: deleteField(),
      updatedAt: new Date()
    });
  }

  protected _createAccess(professionalEmail: string, patientEmail: string, userId: string, creator: string) {
    const now = new Date();
    const isoNow = now.toISOString().slice(0, 16);
    const access: Access = this.cryptService.encryptObject({
      id: userId,
      email: patientEmail,
      patientAcceptedAt: (creator === 'professional') ? null : isoNow,
      professionalAcceptedAt: (creator === 'professional') ? isoNow : null,
      createdAt: isoNow,
      updatedAt: isoNow,
    });
    return setDoc(doc(this.firestore, `professionals/${professionalEmail}`), {
      [access.id]: access,
      updatedAt: now,
    }, { merge: true });
  }

  protected _updatedAcceptance(email: string, userId: string, accepted: boolean, changer: string) {
    const now = new Date();
    const field = (changer === 'professional') ? 'professionalAcceptedAt' : 'patientAcceptedAt';
    const access = this.cryptService.encryptObject({
      [field]: (accepted) ? now.toISOString().slice(0, 16) : null,
      updatedAt: now.toISOString().slice(0, 16),
    });
    return setDoc(doc(this.firestore, `professionals/${email}`), {
      [userId]: access,
      updatedAt: now,
    }, { merge: true });
  }
}
