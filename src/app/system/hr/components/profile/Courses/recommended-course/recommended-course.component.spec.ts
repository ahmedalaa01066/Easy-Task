import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedCourseComponent } from './recommended-course.component';

describe('RecommendedCourseComponent', () => {
  let component: RecommendedCourseComponent;
  let fixture: ComponentFixture<RecommendedCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendedCourseComponent]
    });
    fixture = TestBed.createComponent(RecommendedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
