import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ApiService } from 'src/app/core/services/api.service';
import { HrService } from '../../services/hr.service';
import { environment } from 'src/environments/environment';
import { DialogModule } from 'primeng/dialog';
import * as moment from 'moment';

import { FormsModule } from '@angular/forms';
import {
  addDocumentViewModel,
  createPenaltiyViewModel,
  EditHierarchyinProfileViewModel,
  EditProfileViewModel,
  ProfileDetailsViewModel,
} from '../../models/interfaces/profile-details-view-model';
import { DropdownModule } from 'primeng/dropdown';
import { CandidateStatus } from '../../models/enum/candidate-status';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { AddPenaltyComponent } from '../../components/profile/penalties/add-penalty/add-penalty.component';
import { CoursesListComponent } from '../../components/profile/Courses/courses-list/courses-list.component';
import { PenaltiesListComponent } from '../../components/profile/penalties/penalties-list/penalties-list.component';
import { AddDocumentComponent } from '../../components/profile/Document/add-document/add-document.component';
import { HierarchyComponent } from '../../components/profile/hierarchy-profile/hierarchy/hierarchy.component';
import { EditHierarachyComponent } from '../../components/profile/hierarchy-profile/edit-hierarachy/edit-hierarachy.component';
import { ActivatedRoute } from '@angular/router';
import { KpiProfileComponent } from '../../components/profile/KPIs/kpi-profile/kpi-profile.component';
import { ApiStatus } from 'src/app/core/models/enums/apiStatus';
import { AnimationOptions, LottieModule } from 'ngx-lottie';
import { AttendanceListComponent } from '../../components/profile/attendance/attendance-list/attendance-list.component';
import { AnnualDrawComponent } from '../../components/profile/annual/annual-draw/annual-draw.component';

@Component({
  selector: 'app-profile',
  standalone: true,
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
    AddPenaltyComponent,
    CoursesListComponent,
    PenaltiesListComponent,
    AddDocumentComponent,
    HierarchyComponent,
    EditHierarachyComponent,
    KpiProfileComponent,
    LottieModule,
    AttendanceListComponent,
    AnnualDrawComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  levels: any[] = [];
  displayEditDialog: boolean = false;
  profile: ProfileDetailsViewModel;
  environment = environment;
  displayEditBioDialog: boolean = false;

  statuses = [
    { id: CandidateStatus.RESIGNED, label: 'Resigned' },
    { id: CandidateStatus.ACTIVE, label: 'Active' },
  ];
  isDragOver = false;
  selectedFiles: File[] = [];
  apiStatus: ApiStatus = ApiStatus.Loading;
  options: AnimationOptions = {
    path: 'assets/loading.json',
  };
  ApiStatus = ApiStatus;
  onFileSelected(event: any) {
    const files = Array.from(event.target.files as File[]);
    this.handleFiles(files);
    // لا داعي لاستدعاء uploadSelectedFiles هنا
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = Array.from((event.dataTransfer?.files || []) as File[]);
    this.handleFiles(files);
    // لا داعي لاستدعاء uploadSelectedFiles هنا
  }

  onDialogHide() {
    this.selectedFiles = [];
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  private handleFiles(files: File[]) {
    this.selectedFiles = [...this.selectedFiles, ...files];
    // لو عايزة تحفظيهم في editForm
  }

  editForm: EditProfileViewModel = {
    id: '',
    firstName: '',
    lastName: '',
    joiningDate: new Date(),
    email: '',
    bio: '',
    phoneNumber: '',
    candidateStatus: 1,
    managerId: '',
    managementId: '',
    departmentId: '',
    levelId: '',
    positionId: '',
    positionName: '',
    documentId: '',
    paths: [],
  };

  constructor(private _hrService: HrService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const candidateId = this.route.snapshot.paramMap.get('id');

    if (candidateId) {
      this.apiStatus = ApiStatus.Loading; // ⬅️ قبل ما نستدعي السيرفر
      this._hrService.getProfileDetails(candidateId).subscribe({
        next: (res: any) => {
          if (res.isSuccess && res.data) {
            this.profile = {
              id: res.data.id,
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              joiningDate: res.data.joiningDate,
              email: res.data.email,
              bio: res.data.bio,
              phoneNumber: res.data.phoneNumber,
              candidateStatus: res.data.candidateStatus,
              managerId: res.data.managerId,
              managementId: res.data.managementId,
              departmentId: res.data.departmentId,
              levelId: res.data.levelId,
              levelName: res.data.levelName,
              positionId: res.data.positionId,
              positionName: res.data.positionName,
              candidateImage: res.data.candidateImage
                ? `${environment.api}/${res.data.candidateImage}`
                : null,
              paths: res.data.paths || [],
              documentId: res.data.documentId,
              documentPath: res.data.documentPath,
            };
            this.apiStatus = ApiStatus.Loaded; // ⬅️ نجاح
          } else {
            this.apiStatus = ApiStatus.Error; // ⬅️ في حالة البيانات مش راجعة
          }
        },
        error: (err) => {
          console.error(err);
          this.apiStatus = ApiStatus.Error; // ⬅️ في حالة الخطأ
        },
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    const initials = (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
    return initials.toUpperCase();
  }


  trackByIndex(index: number, item: any): number {
    return index;
  }

  openEditDialog() {
    this.editForm = {
      id: this.profile.id,
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      email: this.profile.email,
      bio: this.profile.bio,
      joiningDate: new Date(this.profile.joiningDate),
      phoneNumber: this.profile.phoneNumber,
      candidateStatus: this.profile.candidateStatus,
      managerId: this.profile.managerId,
      managementId: this.profile.managementId,
      departmentId: this.profile.departmentId,
      levelId: this.profile.levelId,
      positionId: this.profile.positionId,
      positionName: this.profile.positionName,
      documentId: this.profile.documentId,
      paths: this.profile.paths || [],
    };

    this.selectedFiles = []; // ⬅️ مهم جدا
    this.displayEditDialog = true;
  }

  saveProfileEdit() {
    if (this.selectedFiles.length > 0) {
      const path = this.profile?.documentPath || 'Documents/Candidates';

      this._hrService.uploadImage(this.selectedFiles, path).subscribe({
        next: (res: any) => {
          if (res.isSuccess && res.data) {
            // حول res.data لـ string[]
            const uploadedData = Array.isArray(res.data)
              ? res.data
              : [res.data];
            const uploadedPaths: string[] = uploadedData.flatMap((p: any) =>
              typeof p === 'string' ? [p] : p.path || []
            );

            // ابعتي الجديد فقط
            this.editForm.paths = uploadedPaths;

            this.selectedFiles = []; // نظف الملفات المؤقتة
            this.saveProfileData(); // بعد رفع الملفات انادي حفظ البيانات
          }
        },
        error: (err) => console.error('Upload error:', err),
      });
    } else {
      this.saveProfileData();
    }
  }

  private saveProfileData() {
    const payload = {
      ...this.editForm,
      joiningDate: this.editForm.joiningDate
        ? moment(this.editForm.joiningDate as Date).format('YYYY-MM-DD')
        : null,
    };

    this._hrService.editProfile(payload as any).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.displayEditDialog = false;
          this.ngOnInit(); // إعادة تحميل البيانات بعد التعديل
        }
      },
      error: (err) => console.error('Edit profile error:', err),
    });
  }

  generateEmail() {
    const firstName = this.editForm.firstName;
    const lastName = this.editForm.lastName;

    if (firstName && lastName) {
      this.editForm.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@untitledui.com`;
    }
  }

  uploadSelectedFiles(files: File[]) {
    if (!files || files.length === 0) return;

    const path = this.profile?.documentPath || 'Documents/Candidates';

    this._hrService.uploadImage(files, path).subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.data) {
          // دمج المسارات الجديدة مع الموجودة
          this.editForm.paths = [...(this.editForm.paths || []), ...res.data];
          this.selectedFiles = [];
          console.log('Updated editForm.paths:', this.editForm.paths);
        }
      },
      error: (err) => console.error('Upload error:', err),
    });
  }

  // addpenality

  showAddPenaltyModal: boolean = false;
  onAddPenalty() {
    this.showAddPenaltyModal = true;
  }
  /**
   * Handle management creation from modal
   * @param penaltyData - The management form data
   */
  onPenaltyAdded(penaltyData: createPenaltiyViewModel): void {
    // Here you would typically call a service to save the management
    // For now, we'll just close the modal
    this.showAddPenaltyModal = false;
  }

  // Edit Bio

  openEditBioDialog() {
    // نحط الـ bio الحالي في الفورم
    this.editForm.bio = this.profile.bio;
    this.displayEditBioDialog = true;
  }

  saveBio() {
    const payload = {
      id: this.profile.id, // candidateId
      bio: this.editForm.bio, // bio فقط
    };

    this._hrService.editBio(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.displayEditBioDialog = false;
          this.ngOnInit(); // إعادة تحميل البيانات بعد الحفظ
        }
      },
      error: (err) => console.error('Edit bio error:', err),
    });
  }
  // add Document
  showAddDocumentModal: boolean = false;
  onAddDocument() {
    this.showAddDocumentModal = true;
  }
  /**
   * Handle management creation from modal
   * @param documentData - The management form data
   */
  onDocumentAdded(documentData: addDocumentViewModel): void {
    // Here you would typically call a service to save the management
    // For now, we'll just close the modal
    this.showAddDocumentModal = false;
  }

  //edit Level

  showEditHierarchyModal: boolean = false;
  onEditHierarchy() {
    this.showEditHierarchyModal = true;
  }
  /**
   * Handle management creation from modal
   * @param hirarchyData - The management form data
   */
  onHierarchyEdit(hirarchyData: EditHierarchyinProfileViewModel): void {
    // Here you would typically call a service to save the management
    // For now, we'll just close the modal
    this.showEditHierarchyModal = false;
  }
}
