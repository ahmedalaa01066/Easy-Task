import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCourseComponent } from './download-course.component';

describe('DownloadCourseComponent', () => {
  let component: DownloadCourseComponent;
  let fixture: ComponentFixture<DownloadCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadCourseComponent]
    });
    fixture = TestBed.createComponent(DownloadCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
