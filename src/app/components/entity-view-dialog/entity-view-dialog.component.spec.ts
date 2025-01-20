import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityViewDialogComponent } from './entity-view-dialog.component';

describe('EntityViewDialogComponent', () => {
  let component: EntityViewDialogComponent;
  let fixture: ComponentFixture<EntityViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
