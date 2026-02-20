import{  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import {
  CreateCandidateViewModel,
  SelectCandidateViewModel,
  SearchCandidateViewModel,
} from '../../../models/interfaces/candidate-view-models';
import { HrService } from '../../../services/hr.service';
import { CandidateService } from '../../../services/candidate/candidate.service';

export enum CandidateStatus {
  RESIGNED = 1,
  ACTIVE = 2,
}
@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css'],
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
  ],
})
export class AddCandidateComponent implements OnInit {
  @ViewChild('fileUploader') fileUploader: FileUpload;
  @ViewChild('imageInput') imageInputRef: any;
  @ViewChild('docInput') docInputRef: any;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() candidateAdded = new EventEmitter<CreateCandidateViewModel>();

  currentStep: number = 0;
  maxDate: Date = new Date();
  candidateForm: FormGroup;
  managementOptions: SelectCandidateViewModel[] = [];
  positionOptions: SelectCandidateViewModel[] = [];
  candidateOptions: SearchCandidateViewModel[] = [];
  hierarchyLevelOptions: SelectCandidateViewModel[] = [];
  departmentOptions: SelectCandidateViewModel[] = [];
  CandidateStatus = CandidateStatus;
  showAttachSaveButton: boolean = false;
  images: { uploaded: boolean; src: string } | null = null;
  uploadPath: string;
  documents: { uploaded: boolean; src: string }[] = [];
  documentId: string;
  candidateId: string;
  uploadUrl = `${environment.api}/UploadMediaEndPoint/UploadMedia`;

  candidateStatusOptions = [
    { name: 'Resigned', id: 1 },
    { name: 'Active', id: 2 },
  ];

  ngOnInit(): void {
    this.resetForm();
    this.resetFiles();
    this.images = null;
    this.documents = [];
    this.loadManagements();
    this.loadLevels();
    this.loadPositions();
    this.loadCandidates();
    // why is this here?
    this.candidateForm.get('management')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadDepartments(id);
      } else {
        this.departmentOptions = [];
        this.candidateForm.patchValue({ department: null });
      }
    });
  }

  constructor(private readonly fb: FormBuilder, private _hrService: HrService, private _candidateService: CandidateService) {
    this.candidateForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
        ],
        email: ['', [Validators.required, Validators.email]],
        joiningDate: [null, Validators.required],
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirmPassword: [null, Validators.required],
        candidateStatus: [1, Validators.required],
        management: [null,],
        department: [null],
        managerId: [null],
        hierarchyLevel: [null, Validators.required],
        position: [null, Validators.required],
        positionName: ['', [Validators.required, Validators.maxLength(100)]],
        bio: [''],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
    this.resetFiles();
    this.images = null;
    this.documents = [];
    if (this.fileUploader) {
      this.fileUploader.clear();
    }
  }

  resetForm() {
    this.currentStep = 0;
    this.candidateForm.reset();
  }

  nextStep() {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {
    const step1Fields = [
      'firstName',
      'lastName',
      'phoneNumber',
      'email',
      'joiningDate',
      'confirmPassword',
      'password'
    ];
    const step2Fields = [
      'hierarchyLevel',
      'position',
      'positionName',
      'candidateStatus'
    ];

    if (this.currentStep === 0) {
      const allValid = step1Fields.every((field) => {
        const control = this.candidateForm.get(field);
        return control && control.valid;
      });
      return allValid && !this.candidateForm.hasError('passwordsMismatch');
    } else if (this.currentStep === 1) {
      return step2Fields.every((field) => {
        const control = this.candidateForm.get(field);
        return control && control.valid;
      });
    } else if (this.currentStep === 1) {
      return step2Fields.every((field) => {
        const control = this.candidateForm.get(field);
        return control && control.valid;
      });
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

  generateEmail() {
    const firstName = this.candidateForm.get('firstName')?.value;
    const lastName = this.candidateForm.get('lastName')?.value;

    if (firstName && lastName) {
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@untitledui.com`;
      this.candidateForm.patchValue({ email });
    }
  }

  onSubmit() {
    if (this.candidateForm.valid) {
      const formData = this.candidateForm.value;
      // const uploadedImage = this.images?.uploaded ? this.images.src : null;

      // const uploadedDocuments = this.documents
      //   .filter((d) => d.uploaded)
      //   .map((d) => d.src);
      const payload: CreateCandidateViewModel = {
        id: '',
        firstName: formData.firstName,
        LastName: formData.lastName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        joiningDate: moment(formData.joiningDate).format('YYYY-MM-DD'),
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        candidateStatus: formData.candidateStatus,
        managerId: formData.managerId,
        managementId: formData.management,
        departmentId: formData.department,
        levelId: formData.hierarchyLevel,
        positionId: formData.position,
        positionName: formData.positionName,
        // candidateImage: uploadedImage,
        // paths: uploadedDocuments,
        bio: formData.bio,
      };

      this._candidateService.postOrUpdateCandidate(payload).subscribe({
        next: (res) => {
          // this.candidateAdded.emit(formData);
          this.currentStep = 2;
          this.uploadPath = res.data.path;
          this.candidateId = res.data.id;
          this.documentId = res.data.documentId;

          this._candidateService.getAllCandidate.emit();
        },
        error: (err) => {
          console.error('Error saving candidate:', err);
        },
      });
    }
  }

  cancel() {
    this.onDialogHide();
    this.images = null;
    this.documents = [];
  }

  loadManagements() {
    this._hrService.getManagementList().subscribe((res) => {
      this.managementOptions = res.data;
    });
  }

  loadCandidates() {
    this._hrService.selectCandidates().subscribe((res) => {
      this.candidateOptions = res.data;
    });
  }
  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  loadDepartments(managementId: string) {
    this._hrService
      .getDepartmentsByManagement(managementId)
      .subscribe((res) => {
        this.departmentOptions = res.data;
      });
  }

  loadLevels() {
    this._hrService.getLevels().subscribe((res) => {
      this.hierarchyLevelOptions = res.data;
    });
  }

  loadPositions() {
    this._hrService.getPositions().subscribe((res) => {
      this.positionOptions = res.data;
    });
  }
  onImageUpload(files: FileList | File[]): void {
    if (!files || files.length === 0 || !this.uploadPath) return;

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
        this._candidateService.getAllCandidate.emit();
        this.visible = false;
        this.showAttachSaveButton = false;
        window.location.reload();

      },
      error: err => {
        console.error('Failed to save attachments', err);
      }
    });
  }


  getUploadedDocuments() {
    return this.documents.filter((doc) => doc.uploaded).map((doc) => doc.src);
  }
  onDialogShow() {
    this.resetForm();
    this.resetFiles();
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


  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.onImageUpload(files);
    }
  }


  removeImage() {
    this.images = null;
  }

  removeDocument(index: number) {
    this.documents.splice(index, 1);
  }

}
