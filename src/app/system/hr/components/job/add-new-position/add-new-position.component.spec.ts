import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPositionComponent } from './add-new-position.component';

describe('AddNewPositionComponent', () => {
  let component: AddNewPositionComponent;
  let fixture: ComponentFixture<AddNewPositionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPositionComponent]
    });
    fixture = TestBed.createComponent(AddNewPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
