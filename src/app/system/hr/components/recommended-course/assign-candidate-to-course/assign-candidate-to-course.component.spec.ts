import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCandidateToCourseComponent } from './assign-candidate-to-course.component';

describe('AssignCandidateToCourseComponent', () => {
  let component: AssignCandidateToCourseComponent;
  let fixture: ComponentFixture<AssignCandidateToCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignCandidateToCourseComponent]
    });
    fixture = TestBed.createComponent(AssignCandidateToCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
