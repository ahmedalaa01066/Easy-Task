import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualListComponent } from './annual-list.component';

describe('AnnualListComponent', () => {
  let component: AnnualListComponent;
  let fixture: ComponentFixture<AnnualListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnualListComponent]
    });
    fixture = TestBed.createComponent(AnnualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
