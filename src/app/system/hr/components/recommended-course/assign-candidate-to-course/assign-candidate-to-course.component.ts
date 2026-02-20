import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { EditCourseComponent } from '../edit-course/edit-course.component';
import { HrService } from '../../../services/hr.service';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import * as moment from 'moment';
import { CreateRecommendedCoursesViewModel } from '../../../models/interfaces/recommended-courses-view-model';
import { ActivatedRoute } from '@angular/router';
import { RecommendedCoursesService } from '../../../services/recommended-courses/recommended-courses.service';

@Component({
  selector: 'app-assign-candidate-to-course',
  templateUrl: './assign-candidate-to-course.component.html',
  styleUrls: ['./assign-candidate-to-course.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    FileUploadModule,
    DropdownModule,
    MultiSelectModule,
    EditCourseComponent
  ],
})
export class AssignCandidateToCourseComponent {
  @Output() close = new EventEmitter<void>();
  @Output() assigned = new EventEmitter<void>();
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() courseAdded = new EventEmitter<CreateRecommendedCoursesViewModel>();
  documents: { uploaded: boolean; src: string }[] = [];

  courseForm: FormGroup;
  managements: any[] = [];
  departments: any[] = [];
  candidates: any[] = [];
  today: Date = new Date();
  courseId: string;
  constructor(private fb: FormBuilder, private _hrService: HrService, private route: ActivatedRoute ,    private _recommendedCoursesService:RecommendedCoursesService
) {
    this.courseForm = this.fb.group({
      managements: [[], []],
      departments: [[], []],
      candidateIds: [[], Validators.required],
      startDate: [this.today, Validators.required],
      endDate: ['', Validators.required]
    },
      { validators: this.dateRangeValidator });
  }

  ngOnInit(): void {
    this.courseId = (this.route.snapshot.paramMap.get('id'));
    this.courseForm.get('managements')?.valueChanges.subscribe((ids) => {
      if (!ids || ids.length === 0) {
        this.loadAllCandidates();
        this.departments = [];
        this.courseForm.patchValue({ departments: [], candidateIds: [] });
      } else {
        this.loadDepartmentsByManagementIds(ids);
        this.courseForm.patchValue({ departments: [], candidateIds: [] });
        this.candidates = [];
      }
    });

    this.courseForm.get('departments')?.valueChanges.subscribe((ids) => {
      if (!ids || ids.length === 0) {
        this.candidates = [];
        this.courseForm.patchValue({ candidateIds: [] });
      } else {
        this.loadCandidatesByDepartmentIds(ids);
        this.courseForm.patchValue({ candidateIds: [] });
      }
    });
  }
  loadAllCandidates() {
    this._hrService.getCandidatesByDepartmentIds(null).subscribe((res) => {
      this.candidates = res.data.map((item: any) => ({
        ...item,
        styleClass: item.assignment === 2 ? 'partial-assigned-option' : null,
      }));
    });
  }
  onSubmit() {
    if (this.courseForm.valid) {
      const formData = this.courseForm.value;

      const uploadedDocuments = this.documents
        .filter((d) => d.uploaded)
        .map((d) => d.src);

      const payload: CreateRecommendedCoursesViewModel = {
        candidateIds: formData.candidateIds,
        courseId: this.courseId,
        startDate: moment(formData.startDate).format('YYYY-MM-DD'),
        endDate: moment(formData.endDate).format('YYYY-MM-DD'),
        name: formData.name,
        hours: formData.hours,
        instructorName: formData.instructorName,
        courseClassification: formData.courseClassification,
        status: formData.status,
        hasExam: formData.hasExam === 2, courseType: formData.courseType,
        link: formData.link,
        // paths: uploadedDocuments,
        content: formData.content
      };

      this._recommendedCoursesService.assignCourse(payload).subscribe({
        next: () => {
          this.courseAdded.emit(payload);
          this.onDialogHide();
          // this._hrService.getAllRecommendedCourses.emit();
          window.location.reload();

        },
        error: (err) => {
          console.error('Error assigning course:', err);
        },
      });
    }
  }
  dateRangeValidator(formGroup: FormGroup) {
    const start = formGroup.get('startDate')?.value;
    const end = formGroup.get('endDate')?.value;

    if (start && end && moment(end).isBefore(moment(start))) {
      return { dateRangeInvalid: true };
    }
    return null;
  }
  onDialogShow() {
    this.courseForm.reset();
    this.loadManagements();
  }

  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  cancel() {
    this.close.emit();
  }

  saveAssignment() {
    if (this.courseForm.valid) {
      this.assigned.emit();
      this.close.emit();
    }
  }


  loadManagements() {
    this._hrService.getManagementsInRecommendedCourses(null).subscribe((res) => {
      this.managements = res.data.map((item: any) => ({
        ...item,
        styleClass: item.assignment === 2 ? 'partial-assigned-option' : null,
      }));
    });
  }

  loadDepartmentsByManagementIds(managementIds: string[]) {
    if (!managementIds || managementIds.length === 0) {
      this.departments = [];
      this.candidates = [];
      return;
    }
    this._hrService.getDepartmentsByManagementIds(managementIds, null).subscribe((res) => {
      this.departments = res.data.map((item: any) => ({
        ...item,
        styleClass: item.assignment === 2 ? 'partial-assigned-option' : null,
      }));
      this.candidates = [];
    });
  }

  loadCandidatesByDepartmentIds(departmentIds: string[]) {
    if (!departmentIds || departmentIds.length === 0) {
      this.candidates = [];
      return;
    }
    this._hrService.getCandidatesByDepartmentIds(departmentIds, null).subscribe((res) => {
      this.candidates = res.data.map((item: any) => ({
        ...item,
        styleClass: item.assignment === 2 ? 'partial-assigned-option' : null,
      }));
    });
  }
}
