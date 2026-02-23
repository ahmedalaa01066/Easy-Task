import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationsListComponent } from './vacations-list.component';

describe('VacationsListComponent', () => {
  let component: VacationsListComponent;
  let fixture: ComponentFixture<VacationsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VacationsListComponent]
    });
    fixture = TestBed.createComponent(VacationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
