import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, deleteDoc, doc, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Entity } from '../interfaces/entity';
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
    this.userService.getUser().then(user => {
      if (!user) return;
      this.userId = user.uid;
      this.entityCollection = collection(this.firestore, `entities-${this.userId}`);
      this.ready = true;
    });
  }

  isReady(): boolean {
    return this.ready;
  }

  getEntities(): Observable<any[]> {
    return collectionData(this.entityCollection, { idField: "id" });
  }

  async addEntity(entity: any): Promise<DocumentReference> {
    const createdAt = new Date();
    const encryptedEntity: any = this.cryptService.encryptObject(entity);
    return addDoc(this.entityCollection, {
      ...encryptedEntity,
      createdAt,
    });
  }

  async deleteEntity(entity: any): Promise<void> {
    await deleteDoc(doc(this.firestore, `entities-${this.userId}/${entity.id}`));
  }
}
