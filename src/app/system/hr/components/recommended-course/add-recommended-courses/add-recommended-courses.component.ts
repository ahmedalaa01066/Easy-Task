import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';
import { CreateCandidateViewModel, SelectCandidateViewModel, SearchCandidateViewModel } from '../../../models/interfaces/candidate-view-models';
import { HrService } from '../../../services/hr.service';
import { CandidateStatus } from '../../../models/enum/candidate-status';
import { CreateRecommendedCoursesViewModel, RecommendedCoursesViewModel, SearchRecommendedCoursesViewModel } from '../../../models/interfaces/recommended-courses-view-model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ChangeDetectorRef } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { RecommendedCoursesService } from '../../../services/recommended-courses/recommended-courses.service';
import { HierarchyService } from '../../../services/hierarchy/hierarchy.service';

@Component({
  selector: 'app-add-recommended-courses',
  templateUrl: './add-recommended-courses.component.html',
  styleUrls: ['./add-recommended-courses.component.css'],
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
    MultiSelectModule
  ],
})
export class AddRecommendedCoursesComponent implements OnInit {
  @ViewChild('fileUploader') fileUploader: FileUpload;
  @ViewChild('imageInput') imageInputRef: any;
  @ViewChild('docInput') docInputRef: any;
  @Input() tabType: 'new' | 'edit' = 'new';
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() courseAdded = new EventEmitter<CreateRecommendedCoursesViewModel>();


  currentStep: number = 0;
  maxDate: Date = new Date();
  uploadPath: string;
  documentId: string;
  candidateId: string;
  courseForm: FormGroup;
  CandidateStatus = CandidateStatus;
  images: { uploaded: boolean; src: string } | null = null;
  documents: { uploaded: boolean; src: string }[] = [];
  uploadUrl = `${environment.api}/UploadMediaEndPoint/UploadMedia`;
  managements: any[] = [];
  searchViewModel: SearchRecommendedCoursesViewModel =
    new SearchRecommendedCoursesViewModel();
  showDeleteDialog: boolean = false;
  page: CRUDIndexPage = new CRUDIndexPage();
  showAttachSaveButton: boolean = false;
  courses: RecommendedCoursesViewModel[] = [];
  totalRecords: number = 0;
  rows: number = 50;
  pageNumber: number = 1;
  first: number = 0;
  departments = [];
  existingCourses = []
  candidates: any[] = [];
  selectedTab: 'new' | 'existing' = 'new';
  today: Date = new Date();
  CourseClassification = [
    { name: 'Online', id: 1 },
    { name: 'Offline', id: 2 },
    { name: 'SelfStudy', id: 3 },
  ];


  CourseStatus = [
    { name: 'Obligatory', id: 1 },
    { name: 'Optional', id: 2 },
  ]


  HasExam = [
    { name: 'No', id: 1 },
    { name: 'Yes', id: 2 }
  ]

  CourseType = [
    { name: 'Internal', id: 1 },
    { name: 'External', id: 2 },
  ]

  Assigment = [
    { name: 'Assigned', id: 1 },
    { name: 'PartiallyAssigned', id: 2 },
    { name: 'Unassigned', id: 3 },
  ]
  ngOnInit(): void {
    this.resetForm();
    this.resetFiles();
    this.images = null;
    this.documents = [];
    this.courseForm.patchValue({
      startDate: this.today
    });
    this.courseForm.get('courseId')?.valueChanges.subscribe((value) => {
      if (this.selectedTab === 'existing' && value?.trim()) {
        this.loadManagements();
      }
      this.loadManagements();
    });
    this.courseForm.get('managements')?.valueChanges.subscribe((selectedManagementIds) => {
      this.loadDepartmentsByManagementIds(selectedManagementIds);
      this.courseForm.patchValue({ departments: [] });

      const departmentsControl = this.courseForm.get('departments');
      if (selectedManagementIds && selectedManagementIds.length > 0) {
        departmentsControl?.setValidators([Validators.required]);
      } else {
        departmentsControl?.clearValidators();
      }
      departmentsControl?.updateValueAndValidity();
    });



    this.courseForm.get('departments')?.valueChanges.subscribe((selectedDepartmentIds) => {
      this.courseForm.patchValue({ candidateIds: [] });
      this.candidates = [];

      const selectedManagementIds = this.courseForm.get('managements')?.value || [];

      if (selectedManagementIds.length === 0) {
        this._hrService.getCandidatesByDepartmentIds().subscribe((res) => {
          this.candidates = res.data || [];
        });
      } else {
        if (selectedDepartmentIds && selectedDepartmentIds.length > 0) {
          this.loadCandidatesByDepartmentIds(selectedDepartmentIds);
        }
      }
    });


    this.loadExistingCourses();
  }

  constructor(
    private readonly fb: FormBuilder,
    private _hrService: HrService,
    private cd: ChangeDetectorRef,
    private _router: Router,
        private _recommendedCoursesService:RecommendedCoursesService,
        private _hierarchyService:HierarchyService

  ) {
    this.courseForm = this.createForm();
  }

  createForm(): FormGroup {
    const form = this.fb.group({
      candidateIds: [[], Validators.required],
      courseId: [''],
      name: ['', [Validators.minLength(2), Validators.maxLength(100)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      date: [null],
      hours: [null],
      content: [null],
      instructorName: ['', [Validators.minLength(2), Validators.maxLength(100)]],
      courseClassification: [null],
      status: [null],
      hasExam: [false],
      courseType: [null],
      link: [
        '',
        [
          Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()+,;=]*)?$/)
        ]
      ],

      managements: [[]],
      departments: [[]]
    }, {
      validators: [this.dateRangeValidator, this.requiredIfNoCourseIdValidator, this.managementRequiresDepartmentValidator]
    });

    return form;
  }



  onDialogHide() {
    if (this.selectedTab === 'existing') {
      this.visible = false;
      this.visibleChange.emit(false);

      this.resetForm();
      this.resetFiles();
      this.images = null;
      this.documents = [];
      if (this.fileUploader) {
        this.fileUploader.clear();
      }
    } else if (this.selectedTab === 'new') {
      this.currentStep = 3;
      setTimeout(() => {
        this.cd.detectChanges();
      }, 0);
    }
  }





  resetForm() {
    this.currentStep = 0;
    this.courseForm.reset();
  }

  nextStep() {
    if (!this.isCurrentStepValid()) {
      return;
    }

    if (this.selectedTab === 'existing') {
      this.currentStep = 2;
    } else {
      this.currentStep = Math.min(this.currentStep + 1, 3);
    }

    setTimeout(() => {
      this.cd.detectChanges();
    }, 0);
  }



  previousStep() {
    if (this.selectedTab === 'existing') {
      this.currentStep = 0;
    } else {
      this.currentStep = Math.max(this.currentStep - 1, 0);
    }

    setTimeout(() => {
      this.cd.detectChanges();
    }, 0);
  }


  isCurrentStepValid(): boolean {
    const form = this.courseForm;
    const courseId = form.get('courseId')?.value?.trim();
    const hasCourseId = !!courseId;
    if (this.selectedTab === 'existing' && this.currentStep === 0) {
      const isValid =
        form.get('courseId')?.valid &&
        form.get('startDate')?.valid &&
        form.get('endDate')?.valid &&
        !form.errors?.['dateRangeInvalid'];

      return isValid;
    }
    // Step 0
    if (this.currentStep === 0) {
      const dateValid =
        form.get('startDate')?.valid &&
        form.get('endDate')?.valid &&
        !form.errors?.['dateRangeInvalid'];

      if (hasCourseId) return dateValid;

      const extraFieldsStep0 = ['name', 'instructorName', 'link', 'status'];
      const allExtraValid = extraFieldsStep0.every(field => {
        const control = form.get(field);
        const value = control?.value;
        return control && control.valid && value !== null && value !== undefined && value !== '';
      });


      // const hasImage = !!this.images;
      // const hasDocuments = this.documents.some(d => d.uploaded);
      // const hasFileOrImage = hasImage || hasDocuments;
      return dateValid && allExtraValid;
    }

    if (this.currentStep === 1) {
      if (hasCourseId) return true;

      const extraFieldsStep1 = ['hours', 'courseClassification', 'hasExam', 'courseType', 'content'];
      const allExtraValid = extraFieldsStep1.every(field => {
        const control = form.get(field);
        const value = control?.value;
        return control && control.valid && value !== null && value !== undefined && value !== '';
      });



      return allExtraValid;
    }


    return true;
  }



  getStatusSeverity(
    status: number
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' {
    switch (status) {
      case CandidateStatus.ACTIVE:
        return 'success';
      case CandidateStatus.RESIGNED:
        return 'secondary';
      default:
        return 'info';
    }
  }
  onFileUpload(event: any) {
    const file = event.files[0];
    if (file) {
      console.log('File uploaded:', file);
    }
  }


  onSubmit() {
    if (this.courseForm.valid) {
      const formData = this.courseForm.value;

      const payload: CreateRecommendedCoursesViewModel = {
        candidateIds: formData.candidateIds,
        courseId: formData.courseId,
        startDate: moment(formData.startDate).format('YYYY-MM-DD'),
        endDate: moment(formData.endDate).format('YYYY-MM-DD'),
        name: formData.name,
        hours: formData.hours,
        instructorName: formData.instructorName,
        courseClassification: formData.courseClassification,
        status: formData.status,
        hasExam: formData.hasExam === 2,
        courseType: formData.courseType,
        link: formData.link,
        content: formData.content
      };

      this._recommendedCoursesService.assignCourse(payload).subscribe({
        next: (res) => {
          this.courseAdded.emit(payload);

          if (this.selectedTab === 'existing') {
            this.onDialogHide();
            window.location.reload();
          } else if (this.selectedTab === 'new') {
            this.currentStep = 3;
            this.uploadPath = res.data.path;
            this.candidateId = res.data.id;
            this.documentId = res.data.documentId;
            this.cd.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error assigning course:', err);
        },
      });
    }
  }


  requiredIfNoCourseIdValidator(formGroup: FormGroup) {
    const courseId = formGroup.get('courseId')?.value;

    if (!courseId || courseId.trim() === '') {
      const requiredFields = ['name', 'hours', 'instructorName', 'courseClassification', 'hasExam', 'content', 'courseType', 'link'];
      let hasError = false;

      requiredFields.forEach(field => {
        const control = formGroup.get(field);
        if (control) {
          control.setValidators(Validators.required);
          control.updateValueAndValidity({ onlySelf: true, emitEvent: false });

          if (control.invalid) {
            hasError = true;
          }
        }
      });

      return hasError ? { requiredFieldsMissing: true } : null;
    } else {
      // Remove validators if courseId is provided
      const optionalFields = ['name', 'hours', 'instructorName', 'courseClassification', 'content', 'hasExam', 'courseType', 'link'];
      optionalFields.forEach(field => {
        const control = formGroup.get(field);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        }
      });

      return null;
    }
  }


cancel() {
  this.visible = false;
  this.visibleChange.emit(false);
  this.resetForm();
  this.resetFiles();
  this.images = null;
  this.documents = [];
  this.currentStep = 0; 
}



  loadManagements() {
    let courseId = this.courseForm.get('courseId')?.value?.trim();
    courseId = courseId || null;

    this._hrService.getManagementsInRecommendedCourses(courseId).subscribe((res) => {
      this.managements = res.data.map((item: any) => ({
        ...item,
        styleClass: item.assignment === 2 ? 'partial-assigned-option' : null
      }));
      const selectedManagementIds = this.managements
        .filter((m: any) => m.assignment === 1 || m.assignment === 2)
        .map((m: any) => m.id.toString());

      this.courseForm.patchValue({ managements: selectedManagementIds });
    });
  }


  // loadManagements() {
  //   let courseId = this.courseForm.get('courseId')?.value?.trim();
  //   courseId = courseId || null;

  //   this._hrService.getManagementsInRecommendedCourses(courseId).subscribe((res) => {
  //     this.managements = res.data.map((item: any) => ({
  //       ...item,
  //       styleClass: item.assignment === 2 ? 'partial-assigned-option' : null
  //     }));
  //     const assigned = this.managements
  //       .filter((m: any) => m.assignment === 1)
  //       .map((d: any) => d.id.toString())


  //     this.courseForm.patchValue({ managements: assigned });
  //   });
  // }

  getUploadedDocuments() {
    return this.documents.filter((doc) => doc.uploaded).map((doc) => doc.src);
  }
  onDialogShow() {
    this.resetForm();
    this.resetFiles();
    const courseId = this.courseForm.get('courseId')?.value;
    if (this.selectedTab === 'existing' && courseId?.trim()) {
      this.loadManagements();
    }
    this.images = null;
    this.documents = [];

  }

  resetFiles() {
    this.images = null;
    this.documents = [];

    if (this.imageInputRef?.nativeElement) {
      this.imageInputRef.nativeElement.value = '';
    }

    if (this.docInputRef?.nativeElement) {
      this.docInputRef.nativeElement.value = '';
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


  loadDepartmentsByManagementIds(managementIds: string[]) {
    if (!managementIds || managementIds.length === 0) {
      this.departments = [];
      this.candidates = [];
      return;
    }

    let courseId = this.courseForm.get('courseId')?.value?.trim();
    courseId = courseId || null;

    this._hrService.getDepartmentsByManagementIds(managementIds, courseId).subscribe((res) => {
      this.departments = res.data.map((item: any) => ({
        ...item,
        styleClass: item.assignment === 2 ? 'partial-assigned-option' : null
      }));
      this.courseForm.patchValue({ departments: [] });
      this.candidates = [];
    });
  }


  loadCandidatesByDepartmentIds(departmentIds?: string[]) {
    let courseId = this.courseForm.get('courseId')?.value?.trim() || null;

    this._hrService.getCandidatesByDepartmentIds(departmentIds, courseId).subscribe((res) => {
      this.candidates = res.data.map((item: any) => ({
        ...item,
        styleClass: item.assignment === 2 ? 'partial-assigned-option' : null
      }));
      const selectedCandidateIds = this.candidates
        .filter((c: any) => c.assignment === 1 || c.assignment === 2)
        .map((d: any) => d.id.toString());

      this.courseForm.patchValue({ candidateIds: selectedCandidateIds });
    });
  }



  loadExistingCourses() {
    this._hrService.getAllCoursesInRecommendedCourses().subscribe((res) => {
      this.existingCourses = res.data;
    });
  }
  selectTab(tab: 'new' | 'existing'): void {
    this.selectedTab = tab;
    this.currentStep = 0;
    this.courseForm.reset();
    this.departments = [];
    this.candidates = [];
  }



  removeDocument(index: number): void {
    this.documents.splice(index, 1);
  }

  isImageFile(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif|svg)$/i.test(fileName);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.onDocumentUpload(event.dataTransfer.files);
    }
  }

  triggerUpload() {
    document.getElementById('docUpload')?.click();
  }


  documentsToUpload: File[] = [];

  onSelectFiles(event: any) {
    const selectedFiles: File[] = event.files || [];

    for (let file of selectedFiles) {
      if (!this.documentsToUpload.some(f => f.name === file.name && f.size === file.size)) {
        this.documentsToUpload.push(file);
      }
    }
  }

  removeSelectedFile(index: number) {
    this.documentsToUpload.splice(index, 1);
  }



  loadCourses() {
    this._recommendedCoursesService
      .getRecommendedCourses(
        this.searchViewModel,
        this.page.orderBy,
        this.page.isAscending,
        this.pageNumber,
        this.rows
      )
      .subscribe({
        next: (response: any) => {
          this.courses = response.data.items || [];

          this.totalRecords = response.totalCount || this.courses.length;
        },
        error: (err) => {
          console.error('Error loading courses:', err);
        },
      });
  }


  managementRequiresDepartmentValidator(formGroup: FormGroup) {
    const managements = formGroup.get('managements')?.value || [];
    const departments = formGroup.get('departments')?.value || [];

    if (managements.length > 0 && departments.length === 0) {
      return { departmentRequiredWhenManagementSelected: true };
    }
    return null;
  }



  onImageUpload(files: FileList): void {
    if (files.length === 0 || !this.uploadPath) return;

    const fileArray = Array.from(files);
    this._hrService.uploadImage(fileArray, this.uploadPath).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data?.path?.length > 0) {
          this.images = {
            uploaded: true,
            src: 'https://20.164.23.26/' + res.data.path,
          };
        } else {
          console.warn('No path returned from server:', res);
        }
        this.showAttachSaveButton = true;
      },
      error: (err) => {
        console.error('Upload failed', err);
      },
    });
  }

  onDocumentUpload(files: FileList): void {
    if (files.length === 0 || !this.uploadPath) return;

    const fileArray = Array.from(files);
    this._hrService.uploadImage(fileArray, this.uploadPath).subscribe({
      next: (res) => {
        if (res.isSuccess && Array.isArray(res.data?.path)) {
          res.data.path.forEach((p: string) => {
            this.documents.push({ uploaded: true, src: p });
          });
        }
        this.showAttachSaveButton = true;

      },
      error: (err) => {
        console.error('Document upload failed', err);
      },
    });
  }
  saveAttachments() {
    if (!this.uploadPath) return;

    const attachments: any[] = [];

    // الصور
    if (this.images?.uploaded) {
      attachments.push({
        sourceType: 2,
        path: this.images.src.replace('https://20.164.23.26/', '')
      });
    }

    // الملفات
    if (this.documents.length > 0) {
      this.documents.forEach(doc => {
        attachments.push({
          sourceType: 1,
          path: doc.src
        });
      });
    }

    const payload = {
      sourceId: this.candidateId,
      documentId: this.documentId,
      attachMediaToDocumentDTOs: attachments
    };

    this._hrService.attachMediaToDocument(payload).subscribe({
      next: res => {
        this._hierarchyService.getAllLevel.emit();
        this.visible = false;
        this.showAttachSaveButton = false;
        window.location.reload();

      },
      error: err => {
        console.error('Failed to save attachments', err);
      }
    });
  }

}
