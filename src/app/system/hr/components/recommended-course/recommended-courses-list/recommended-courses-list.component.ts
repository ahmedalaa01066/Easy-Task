import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { HrService } from '../../../services/hr.service';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import {
  GetAllCandidatesForCourseViewModel,
  ManagementIDAndNameDTO,
  RecommendedCoursesViewModel,
  SearchRecommendedCoursesViewModel,
} from '../../../models/interfaces/recommended-courses-view-model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SharedService } from 'src/app/core/services/shared.service';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment'; // لو مش مستورد بالفعل
import { RecommendedCoursesService } from '../../../services/recommended-courses/recommended-courses.service';

@Component({
  selector: 'app-recommended-courses-list',
  templateUrl: './recommended-courses-list.component.html',
  styleUrls: ['./recommended-courses-list.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    DialogModule,
    AvatarModule
  ],
})
export class RecommendedCoursesListComponent implements OnInit, OnChanges {
  constructor(
    private readonly _hrService: HrService,
    private _sharedService: SharedService,
    private _router: Router,
    private _recommendedCoursesService:RecommendedCoursesService
  ) {}
  @Input() searchTerm: string = '';

  selectedManagementName: string | null = null;
  confirmUnassignDialogVisible: boolean = false;
  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: SearchRecommendedCoursesViewModel =
    new SearchRecommendedCoursesViewModel();
  showDeleteDialog: boolean = false;
  selectedItem: RecommendedCoursesViewModel | null = null;
  courses: RecommendedCoursesViewModel[] = [];
  totalRecords: number = 0;
  rows: number = 50;
  pageNumber: number = 1;
  first: number = 0;
  managementPopupVisible: boolean = false;
  managementPopupList: ManagementIDAndNameDTO[] = [];
  candidatesDialogVisible = false;
  candidatesList: GetAllCandidatesForCourseViewModel[] = [];
  loadingCandidates = false;
  selectedCourseId: string | null = null;
  selectedManagementIds: string[] = [];
  selectedCandidateIds: string[] = [];
  confirmUnassignCandidatesDialogVisible: boolean = false;
  environment = environment;
  images = [{ uploaded: false, src: null }];
  ngOnInit(): void {
    this.loadCourses();
  }
  showManagementPopup(course: RecommendedCoursesViewModel) {
    this.selectedItem = course;
    this.managementPopupList = course.assignedManagements;
    this.managementPopupVisible = true;
  }

  getManagementNamesParts(assignedManagements: ManagementIDAndNameDTO[]): {
    names: string;
    extraCount: number;
  } {
    if (!assignedManagements?.length) return { names: '', extraCount: 0 };

    const names = assignedManagements
      .slice(0, 3)
      .map((m) => m.name)
      .join(', ');
    const extraCount = assignedManagements.length - 3;

    return { names, extraCount: extraCount > 0 ? extraCount : 0 };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      this.searchViewModel.Name = this.searchTerm;
      this.loadCourses();
    }
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

  /**
   * Handle pagination
   */
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageNumber = Math.ceil((this.first + 1) / this.rows);
    this.loadCourses();
  }

  /**
   * View candidate profile
   */
  viewProfile() {
    console.log('View profile');
  }

  /**
   * Edit Course
   */
  editCourse() {
    console.log('Couse Edit');
  }
  /**
   * Delete Course
   */
  showDeleteConfirmation(item: RecommendedCoursesViewModel) {
    this.selectedItem = item;
    this.showDeleteDialog = true;
  }

  deleteCourse() {
    if (!this.selectedItem) return;

    this._recommendedCoursesService.removeCourse(this.selectedItem).subscribe((res) => {
      if (res.isSuccess) {
        this.courses = this.courses.filter(
          (course) => course.id !== this.selectedItem?.id
        );
        this.loadCourses();
      }
      this.showDeleteDialog = false;
      this.selectedItem = null;
    });
  }

  onRemoveManagement(item: ManagementIDAndNameDTO, courseId: string) {
    this.selectedManagementName = item.name; // إذا كنتِ بتعرضي الاسم في رسالة تأكيد
    this.selectedCourseId = courseId;

    // إضافة الـ id للمصفوفة لو مش موجود بالفعل
    if (!this.selectedManagementIds.includes(item.id)) {
      this.selectedManagementIds.push(item.id);
    }

    // حذف العنصر من القائمة المعروضة
    this.managementPopupList = this.managementPopupList.filter(
      (m) => m.id !== item.id
    );
  }

  onSaveManagementChanges() {
    if (
      !this.selectedManagementIds ||
      this.selectedManagementIds.length === 0
    ) {
      this.managementPopupVisible = false;
      return; // لا شيء للحذف
    }

    this.managementPopupVisible = false;

    setTimeout(() => {
      this.confirmUnassignDialogVisible = true;
    }, 200);
  }

  confirmUnassignManagements() {
    if (
      !this.selectedCourseId ||
      !this.selectedManagementIds ||
      this.selectedManagementIds.length === 0
    )
      return;

    this._recommendedCoursesService
      .unassignManagementFromCourse(
        this.selectedCourseId,
        this.selectedManagementIds
      )
      .subscribe({
        next: (res) => {
          console.log('Unassigned successfully');
          this.confirmUnassignDialogVisible = false;
          this.managementPopupVisible = false;
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error unassigning:', err);
        },
      });
  }

  showCandidatesForCourse(course: any) {
    this.loadingCandidates = true;
    this.candidatesDialogVisible = true;
    this.selectedCourseId = course.id; // مهم لو هتعملي unassign

    this._recommendedCoursesService.GetAllCandidatesForCourse(course.id).subscribe({
      next: (res) => {
        this.candidatesList = res.data?.items || []; // ✅ هنا التعديل
        this.loadingCandidates = false;
      },
      error: (err) => {
        console.error('Error fetching candidates', err);
        this.loadingCandidates = false;
      },
    });
  }

  onRemoveCandidate(candidate: GetAllCandidatesForCourseViewModel) {
    if (!this.selectedCandidateIds.includes(candidate.candidateId)) {
      this.selectedCandidateIds.push(candidate.candidateId);
    }

    // حذف من القائمة المعروضة
    this.candidatesList = this.candidatesList.filter(
      (c) => c.candidateId !== candidate.candidateId
    );
  }

  onSaveCadidatesChanges() {
    if (!this.selectedCandidateIds || this.selectedCandidateIds.length === 0) {
      this.candidatesDialogVisible = false;
      return;
    }

    this.candidatesDialogVisible = false;

    setTimeout(() => {
      this.confirmUnassignCandidatesDialogVisible = true;
    }, 200);
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
          this.loadCourses(); // حملي الكورسات تاني
        },
        error: (err) => {
          console.error('Error unassigning candidates:', err);
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

  isImageUploaded(): boolean {
    return this.images.some(image => image.uploaded); // Returns true if at least one image is uploaded
  }
}
