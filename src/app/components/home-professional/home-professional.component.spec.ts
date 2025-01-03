import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProfessionalComponent } from './home-professional.component';

describe('HomeProfessionalComponent', () => {
  let component: HomeProfessionalComponent;
  let fixture: ComponentFixture<HomeProfessionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProfessionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
