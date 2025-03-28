import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { CryptService } from './crypt.service';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private cryptService = inject(CryptService);
  private entityCollection: any;
  private userId: string = '';
  private ready = false;

  constructor() {
    this.userService.getUserFirstValue().then(user => {
      if (!user) return;
      this.userId = user.uid;
      this.entityCollection = collection(this.firestore, `entities-${this.userId}`);
      this.ready = true;
    });
  }

  isReady() {
    return this.ready;
  }

  getEntities() {
    return collectionData(this.entityCollection, { idField: "id" });
  }

  getEntitiesFromPatient(id: string) {
    return collectionData(collection(this.firestore, `entities-${id}`), { idField: "id" });
  }

  addEntity(entity: any) {
    const encryptedEntity = this.cryptService.encryptObject(entity);
    return addDoc(this.entityCollection, encryptedEntity);
  }

  deleteEntity(entity: any) {
    deleteDoc(doc(this.firestore, `entities-${this.userId}/${entity.id}`));
  }
}
