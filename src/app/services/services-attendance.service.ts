import { inject, Injectable } from '@angular/core';
import { AccessService } from './access.service';
import { collection, collectionData, doc } from '@angular/fire/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesAttendanceService extends AccessService {

  private userService = inject(UserService);
  private servicesCollection = collectionData(collection(this.firestore, 'services'));
  private services: any = [];
  constructor() {
    super()
    this.servicesCollection.subscribe(services => this.services = services);
    this.userService.getUserObservable().subscribe(user => {
      if (!user?.email) return;
    });
  }

  getServices() {
    return this.services;
  }
}
