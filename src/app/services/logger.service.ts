import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { ACTION_TYPES } from '../enums/action-types.enum';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private userService = inject(UserService);
  private firestore = inject(Firestore);
  private auditCollection: any;
  private email: string = '';

  constructor() {
    this.auditCollection = collection(this.firestore, 'audit');
    this.userService.getUserObservable().subscribe(user => {
      if (!user?.email) return;
      this.email = user.email;
    });
  }

  log(action: ACTION_TYPES, target: string) {
    const email = this.email;
    const timestamp = new Date();
    const logId = `${timestamp.toISOString()}_${window.crypto.randomUUID().substring(0, 8)}`;
    setDoc(doc(this.auditCollection, logId), {
      email,
      timestamp,
      action,
      target
    });
  }
}
