import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedCoursesListComponent } from './recommended-courses-list.component';

describe('RecommendedCoursesListComponent', () => {
  let component: RecommendedCoursesListComponent;
  let fixture: ComponentFixture<RecommendedCoursesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendedCoursesListComponent]
    });
    fixture = TestBed.createComponent(RecommendedCoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
