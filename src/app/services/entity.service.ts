import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { CryptService } from './crypt.service';
import { LoggerService } from './logger.service';
import { ACTION_TYPES } from '../enums/action-types.enum';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  private loggerService = inject(LoggerService);
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private cryptService = inject(CryptService);
  private entityCollection: any;
  private entitiesCollectionId: string = '';
  private ready = false;

  constructor() {
    this.userService.getUserFirstValue().then(user => {
      if (!user) return;
      this.entitiesCollectionId = `entities-${user.uid}`;
      this.entityCollection = collection(this.firestore, this.entitiesCollectionId);
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
    const promise = addDoc(this.entityCollection, encryptedEntity);
    promise.then((docRef) => this.loggerService.log(ACTION_TYPES.CREATED, `entity ${this.entitiesCollectionId}/${docRef.id}`));
    return promise;
  }

  deleteEntity(entity: any) {
    const target = `${this.entitiesCollectionId}/${entity.id}`;
    deleteDoc(doc(this.firestore, target)).then(() => this.loggerService.log(ACTION_TYPES.CREATED, `entity ${target}`));
  }
}
