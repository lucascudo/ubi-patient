import { inject, Injectable } from '@angular/core';
import { deleteField, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { CryptService } from './crypt.service';
import { Access } from '../interfaces/access';
import { LoggerService } from './logger.service';
import { ACTION_TYPES } from '../enums/action-types.enum';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private loggerService = inject(LoggerService);
  protected cryptService = inject(CryptService);
  protected firestore = inject(Firestore);

  protected _deleteAccess(email: string, id: string) {
    const promise = updateDoc(doc(this.firestore, `professionals/${email}`), {
      [id]: deleteField(),
      updatedAt: new Date()
    });
    promise.then(() => this.loggerService.log(ACTION_TYPES.DELETED, `access professionals/${email}/${id}`));
    return promise;
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
    const promise = setDoc(doc(this.firestore, `professionals/${professionalEmail}`), {
      [access.id]: access,
      updatedAt: now,
    }, { merge: true });
    promise.then(() => this.loggerService.log(ACTION_TYPES.CREATED, `access professionals/${professionalEmail}/${access.id}`));
    return promise;
  }

  protected _updatedAcceptance(email: string, userId: string, accepted: boolean, changer: string) {
    const now = new Date();
    const field = (changer === 'professional') ? 'professionalAcceptedAt' : 'patientAcceptedAt';
    const access = this.cryptService.encryptObject({
      [field]: (accepted) ? now.toISOString().slice(0, 16) : null,
      updatedAt: now.toISOString().slice(0, 16),
    });
    const promise = setDoc(doc(this.firestore, `professionals/${email}`), {
      [userId]: access,
      updatedAt: now,
    }, { merge: true });
    promise.then(() => this.loggerService.log(ACTION_TYPES.UPDATED, `access professionals/${email}/${userId}`));
    return promise;
  }
}
