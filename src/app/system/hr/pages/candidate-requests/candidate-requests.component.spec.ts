import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateRequestsComponent } from './candidate-requests.component';

describe('CandidateRequestsComponent', () => {
  let component: CandidateRequestsComponent;
  let fixture: ComponentFixture<CandidateRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateRequestsComponent]
    });
    fixture = TestBed.createComponent(CandidateRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
