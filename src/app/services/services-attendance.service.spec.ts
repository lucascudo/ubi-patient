import { TestBed } from '@angular/core/testing';

import { ServicesAttendanceService } from './services-attendance.service';

describe('ServicesAttendenceService', () => {
  let service: ServicesAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
