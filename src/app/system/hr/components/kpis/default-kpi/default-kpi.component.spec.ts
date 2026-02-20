import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultKpiComponent } from './default-kpi.component';

describe('DefaultKpiComponent', () => {
  let component: DefaultKpiComponent;
  let fixture: ComponentFixture<DefaultKpiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultKpiComponent]
    });
    fixture = TestBed.createComponent(DefaultKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
