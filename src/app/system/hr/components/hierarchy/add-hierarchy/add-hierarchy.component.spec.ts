import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHierarchyComponent } from './add-hierarchy.component';

describe('AddHierarchyComponent', () => {
  let component: AddHierarchyComponent;
  let fixture: ComponentFixture<AddHierarchyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHierarchyComponent]
    });
    fixture = TestBed.createComponent(AddHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
