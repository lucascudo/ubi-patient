import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private firestore = inject(Firestore);
  private configCollection;

  constructor() {
    this.configCollection = collection(this.firestore, 'config');
  }

  private async getConfigById(id: string) {
    const allConfigs = firstValueFrom(collectionData(this.configCollection, { idField: 'id' }));
    const configs = (await allConfigs).filter(c => c.id === id).map(c => {
      delete c.id;
      return c;
    });
    if (!configs.length) {
      throw new Error(`Config ${id} not found`);
    }
    return configs[0];
  }

  getEntityTypes() {
    return this.getConfigById('entityTypes');
  }

}
