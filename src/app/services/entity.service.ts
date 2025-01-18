import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, deleteDoc, doc, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);
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
    console.log(entity);
    if (entity.image) {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64Image = reader.result as string;
          const entityWithImage = {
            type: entity.type,
            name: entity.name,
            description: entity.description,
            image: base64Image,
          };
          addDoc(this.entityCollection, entityWithImage).then(resolve).catch(reject);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(entity.image);
      });
    } else {
      const entityWithoutImage = {
        type: entity.type,
        name: entity.name,
        description: entity.description,
        image: null,
      };
      return addDoc(this.entityCollection, entityWithoutImage);
    }
  }

  async deleteEntity(entity: any): Promise<void> {
    await deleteDoc(doc(this.firestore, `entities-${this.userId}/${entity.id}`));
  }
}
