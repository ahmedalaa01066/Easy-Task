import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecommendedCoursesComponent } from './add-recommended-courses.component';

describe('AddRecommendedCoursesComponent', () => {
  let component: AddRecommendedCoursesComponent;
  let fixture: ComponentFixture<AddRecommendedCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRecommendedCoursesComponent]
    });
    fixture = TestBed.createComponent(AddRecommendedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
