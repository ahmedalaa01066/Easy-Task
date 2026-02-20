import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiProfileComponent } from './kpi-profile.component';

describe('KpiProfileComponent', () => {
  let component: KpiProfileComponent;
  let fixture: ComponentFixture<KpiProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiProfileComponent]
    });
    fixture = TestBed.createComponent(KpiProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
