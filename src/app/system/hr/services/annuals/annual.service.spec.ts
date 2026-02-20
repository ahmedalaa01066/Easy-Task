import { TestBed } from '@angular/core/testing';

import { AnnualService } from './annual.service';

describe('AnnualService', () => {
  let service: AnnualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
