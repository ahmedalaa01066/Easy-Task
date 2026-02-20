import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { HrService } from '../../../services/hr.service';
import {
  GetAllCandidatesForCourseViewModel,
  GetCourseByIdViewModel,
  RecommendedCoursesViewModel,
} from '../../../models/interfaces/recommended-courses-view-model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { environment } from 'src/environments/environment';
import { EditCourseComponent } from '../edit-course/edit-course.component';
import { AssignCandidateToCourseComponent } from '../assign-candidate-to-course/assign-candidate-to-course.component';
import { RecommendedCoursesService } from '../../../services/recommended-courses/recommended-courses.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    AvatarModule,
    DialogModule,
    EditCourseComponent,
    AssignCandidateToCourseComponent
  ],
})
export class CourseDetailsComponent implements OnInit {
  courseDetails!: GetCourseByIdViewModel;
  candidates: GetAllCandidatesForCourseViewModel[] = [];
  loading: boolean = true;
  showAssignDialog = false;
courseId: string = '';
  showDeleteDialog: boolean = false;
  totalRecords: number = 0;
  rows: number = 50;
  pageNumber: number = 1;
  first: number = 0;
  selectedCourseId: string | null = null;
  confirmUnassignCandidatesDialogVisible: boolean = false;
  selectedCandidateIds: string[] = [];
  environment = environment;
  showEditDialog = false;

  images = [{ uploaded: false, src: null }];
  constructor(
    private hrService: HrService,
    private route: ActivatedRoute,
    private router: Router,
    private _recommendedCoursesService:RecommendedCoursesService

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.courseId = params.get('id') || '';
      console.log('Course ID:', this.courseId);

      if (this.courseId) {
        this.loadCourseDetails();
        this.loadCandidates();
      }
    });
  }

  loadCourseDetails() {
    this._recommendedCoursesService.getCourseById(this.courseId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.courseDetails = res.data;
        }
      },
      error: (err) => console.error(err),
    });
  }

  loadCandidates() {
    this.loading = true;
    this._recommendedCoursesService.GetAllCandidatesForCourse(this.courseId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.candidates = res.data.items;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
  getInitialsFromFullName(fullName?: string): string {
    if (!fullName) return '?';
    const name = fullName.trim();
    if (!name) return '?';

    const parts = name.split(/\s+/).filter((p) => p.length > 0);
    if (parts.length === 1) {
      const p = parts[0];
      return (p.charAt(0) + (p.charAt(1) || '')).toUpperCase();
    } else {
      const first = parts[0].charAt(0);
      const last = parts[parts.length - 1].charAt(0);
      return (first + last).toUpperCase();
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageNumber = Math.ceil((this.first + 1) / this.rows);
    this.loadCandidates();
  }
  showDeleteConfirmation() {
    this.selectedCourseId = this.courseId;
    this.showDeleteDialog = true;
  }

  deleteCourse() {
    if (!this.selectedCourseId) return;

    const body: RecommendedCoursesViewModel = {
      id: this.selectedCourseId,
      name: '',
      numOfCandidates: 0,
      assignedManagements: [],
    };

    this._recommendedCoursesService.removeCourse(body).subscribe((res) => {
      if (res.isSuccess) {
        this.router.navigate(['/hr/recommendedCourses']);
      }
      this.showDeleteDialog = false;
      this.selectedCourseId = null;
    });
  }
 showUnassginCandidate(candidateId: string) {
  this.selectedCourseId = this.courseId;
  this.selectedCandidateIds = [candidateId]; // هنا بنخزن الـ ID في المصفوفة
  this.confirmUnassignCandidatesDialogVisible = true;
}

openAssignCandidate() {
  this.showAssignDialog = true;
}

  confirmUnassignCandidates() {
    if (
      !this.selectedCourseId ||
      !this.selectedCandidateIds ||
      this.selectedCandidateIds.length === 0
    )
      return;

    this._recommendedCoursesService
      .unassignCandidatesFromCourse(
        this.selectedCourseId,
        this.selectedCandidateIds
      )
      .subscribe({
        next: (res) => {
          console.log('Candidates unassigned successfully');
          this.confirmUnassignCandidatesDialogVisible = false;
          this.selectedCandidateIds = [];
          this.loadCandidates(); 
          this.loadCourseDetails();
        },
        error: (err) => {
          console.error('Error unassigning candidates:', err);
        },
      });
  }

  isImageUploaded(): boolean {
    return this.images.some(image => image.uploaded); // Returns true if at least one image is uploaded
  }

  
openEditCourse() {
  this.showEditDialog = true;
}
reloadCourseDetails() {
  this.loadCourseDetails();
  this.loadCandidates(); 
}
}
