import { TestBed } from '@angular/core/testing';

import { ServicesAttendenceService } from './services-attendence.service';

describe('ServicesAttendenceService', () => {
  let service: ServicesAttendenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesAttendenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
