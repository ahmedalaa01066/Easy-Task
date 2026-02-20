import { TestBed } from '@angular/core/testing';

import { CandidateRequestService } from './candidate-request.service';

describe('CandidateRequestService', () => {
  let service: CandidateRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
