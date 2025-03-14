import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private firestore = inject(Firestore);
  private config;

  constructor() {
    const configCollection = collection(this.firestore, 'config');
    this.config = firstValueFrom(collectionData(configCollection, { idField: 'id' }));
  }

  private async getConfigById(id: string) {
    const configs = (await this.config).filter(c => c.id === id).map(c => {
      delete c.id;
      return c;
    });
    if (!configs.length) {
      throw new Error(`Config ${id} not found`);
    }
    return configs.pop();
  }

  async getEntityTypes() {
    return await this.getConfigById('entityTypes');
  }

}
