import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLogsComponent } from './patient-logs.component';

describe('PatientLogsComponent', () => {
  let component: PatientLogsComponent;
  let fixture: ComponentFixture<PatientLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
