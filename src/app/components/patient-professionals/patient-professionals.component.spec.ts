import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientProfessionalsComponent } from './patient-professionals.component';

describe('PatientProfessionalsComponent', () => {
  let component: PatientProfessionalsComponent;
  let fixture: ComponentFixture<PatientProfessionalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientProfessionalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientProfessionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
