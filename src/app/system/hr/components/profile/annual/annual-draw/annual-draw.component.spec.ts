import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualDrawComponent } from './annual-draw.component';

describe('AnnualDrawComponent', () => {
  let component: AnnualDrawComponent;
  let fixture: ComponentFixture<AnnualDrawComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnualDrawComponent]
    });
    fixture = TestBed.createComponent(AnnualDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
