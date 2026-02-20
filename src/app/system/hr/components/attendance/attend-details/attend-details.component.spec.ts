import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendDetailsComponent } from './attend-details.component';

describe('AttendDetailsComponent', () => {
  let component: AttendDetailsComponent;
  let fixture: ComponentFixture<AttendDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendDetailsComponent]
    });
    fixture = TestBed.createComponent(AttendDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
