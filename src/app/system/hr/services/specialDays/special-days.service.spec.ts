import { TestBed } from '@angular/core/testing';

import { SpecialDaysService } from './special-days.service';

describe('SpecialDaysService', () => {
  let service: SpecialDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
