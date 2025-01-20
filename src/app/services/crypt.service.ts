import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CryptService {
  private readonly reservedKeys = ['id'];

  encryptString(data: string): string {
    if (!data?.length) return data;
    return CryptoJS.AES.encrypt(data, environment.aesKey).toString();
  }

  encryptObject(object: any, excludes: string[] = []): any {
    const encryptedObject: any = {};
    for (let key of Object.keys(object)) {
      encryptedObject[key] = (this.reservedKeys.includes(key) || excludes.includes(key)) ? object[key] : this.encryptString(object[key]);
    }
    return encryptedObject;
  }

  decryptString(data: string): string {
    if (!data?.length) return data;
    const bytes = CryptoJS.AES.decrypt(data, environment.aesKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  decryptObject(encryptedObject: any, excludes: string[] = []): any {
    const object: any = {};
    for (let key of Object.keys(encryptedObject)) {
      object[key] = (this.reservedKeys.includes(key) || excludes.includes(key)) ? encryptedObject[key] : this.decryptString(encryptedObject[key]);
    }
    return object;
  }
}
