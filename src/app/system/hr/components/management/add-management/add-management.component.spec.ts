import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManagementComponent } from './add-management.component';

describe('AddManagementComponent', () => {
  let component: AddManagementComponent;
  let fixture: ComponentFixture<AddManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddManagementComponent]
    });
    fixture = TestBed.createComponent(AddManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
