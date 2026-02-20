import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRequestComponent } from './all-request.component';

describe('AllRequestComponent', () => {
  let component: AllRequestComponent;
  let fixture: ComponentFixture<AllRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllRequestComponent]
    });
    fixture = TestBed.createComponent(AllRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
