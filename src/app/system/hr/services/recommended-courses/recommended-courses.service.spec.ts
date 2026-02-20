import { TestBed } from '@angular/core/testing';

import { RecommendedCoursesService } from './recommended-courses.service';

describe('RecommendedCoursesService', () => {
  let service: RecommendedCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendedCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
