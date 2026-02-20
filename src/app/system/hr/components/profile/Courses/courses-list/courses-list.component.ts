import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HrService } from '../../../../services/hr.service';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { PaginatorModule } from 'primeng/paginator';
import { DownloadCourseComponent } from '../download-course/download-course.component';
import { RecommendedCourseComponent } from '../recommended-course/recommended-course.component';
import { editCourse } from '../../../../models/interfaces/recommended-courses-view-model';

import { RecommendedCoursesService } from 'src/app/system/hr/services/recommended-courses/recommended-courses.service';
import { EditCourseComponent } from '../../../recommended-course/edit-course/edit-course.component';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    AvatarModule,
    TagModule,
    DividerModule,
    TooltipModule,
    AvatarModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    PaginatorModule,
    DownloadCourseComponent,
    RecommendedCourseComponent,
    EditCourseComponent
  ],
})
export class CoursesListComponent {
  @Input() candidateId!: string;
  courses: any[] = [];
  page: CRUDIndexPage = new CRUDIndexPage();
  totalRecords: number = 0;
  pageNumber: number = 1;
  totalPages: number = 0;

  rows: number = 50;
  showDocuments: boolean = false;
  selectedCourseDocs: any[] = [];
  showRecommended: boolean = false;
  selectedCourse: editCourse | null = null;
  showEditCourseModal = false;
  confirmUnassignCandidateDialogVisible: boolean = false;
  selectedCourseId: string | null = null;
  openRecommendedCourse() {
    this.showRecommended = true;
  }

  constructor(private _hrService: HrService , private _recommendedCoursesService:RecommendedCoursesService) { }
  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this._hrService.getAllCoursesInProfile(
      this.candidateId,
      this.page.orderBy,
      this.page.isAscending,
      this.pageNumber,
      this.rows
    ).subscribe({
      next: (res: any) => {
        this.courses = res.data.items;

        this.totalRecords = res.data.records;
        this.totalPages = res.data.pages;
        this.pageNumber = res.data.pageIndex;
        this.rows = res.data.pageSize;
      },
      error: (err) => {
        console.error('Error loading courses', err);
      },
    });
  }

  goToPrevious() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getCourses();
    }
  }

  goToNext() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getCourses();
    }
  }
  hasRecommendedCourse(): boolean {
    return this.courses.some((c) => c.recommended);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.rows = event.rows;
    this.getCourses();
  }


  openDocuments(course: any) {
    this._hrService.getAllMedia(course.documentId).subscribe({
      next: (res: any) => {
        this.selectedCourseDocs = res.data.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
        }));
        this.showDocuments = true;
      },
      error: (err) => {
        console.error('Error loading documents', err);
      },
    });
  }


  onEditCourse(course: editCourse) {
    this.selectedCourse = { ...course };
    this.showEditCourseModal = true;
  }


  onCourseUpdated() {
    this.getCourses();
  }


  onUnassignCandidate(course: any) {
    this.selectedCourseId = course.id;
    this.confirmUnassignCandidateDialogVisible = true;
  }

  confirmUnassignCandidate() {
    if (!this.selectedCourseId || !this.candidateId) return;

    this._recommendedCoursesService
      .unassignCandidatesFromCourse(this.selectedCourseId, [this.candidateId])
      .subscribe({
        next: (res) => {
          console.log('Candidate unassigned successfully');
          this.confirmUnassignCandidateDialogVisible = false;
          this.getCourses();
        },
        error: (err) => {
          console.error('Error unassigning candidate:', err);
        },
      });
  }
}