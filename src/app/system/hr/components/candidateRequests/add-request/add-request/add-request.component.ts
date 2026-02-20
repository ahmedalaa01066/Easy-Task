import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { candidateRequestType } from 'src/app/system/hr/models/enum/candidate-request';
import { createPermissionRequestViewModel, CreateVacationRequestViewModel } from 'src/app/system/hr/models/interfaces/candidate-request-vm';
import { CandidateRequestService } from 'src/app/system/hr/services/candidateRequest/candidate-request.service';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css'],
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
export class AddRequestComponent {
  @ViewChild('fileUploader') fileUploader: FileUpload;
  @ViewChild('imageInput') imageInputRef: any;
  @ViewChild('docInput') docInputRef: any;
  @Input() activeOuterTab!: candidateRequestType;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() candidateAdded = new EventEmitter<CreateVacationRequestViewModel>();
  @Input() candidateId: string;
  @Input() editData: { type: string, id: string } | null = null;
  activeTab: 'request' | 'permission' = 'request';
  minDate: Date = new Date();
  candidateRequestType = candidateRequestType;
  requestForm!: FormGroup;
  permissionForm!: FormGroup;
  vacations: any[] = [];
  permissions: any[] = [];
  constructor(
    private fb: FormBuilder,
    private candidateRequestService: CandidateRequestService
  ) { }


  ngOnInit() {
    this.requestForm = this.fb.group({
      id: [null],
      candidateId: [this.candidateId],
      vacationId: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    }, { validator: this.dateValidator });

    this.permissionForm = this.fb.group({
      id: [null],
      candidateId: [this.candidateId],
      permissionId: [null, Validators.required],
      date: [null, Validators.required],
      fromTime: [null, Validators.required],
      toTime: [null, Validators.required],
    }, { validator: this.timeValidator });
    this.loadDropdowns();
  }


  // Custom Validator للـ FromTime و ToTime
  timeValidator(group: FormGroup) {
    const fromTime = group.get('fromTime')?.value;
    const toTime = group.get('toTime')?.value;

    if (!fromTime || !toTime) {
      return null; // لو واحد منهم فاضي، ما نعملش validate دلوقتي
    }

    const from = new Date(fromTime).getTime();
    const to = new Date(toTime).getTime();

    if (from >= to) {
      // From أكبر من أو يساوي To → invalid
      return { timeInvalid: true };
    }

    return null; // Valid
  }

  ngOnChanges() {
    if (this.editData) {
      if (this.editData.type === 'vacation') {
        this.activeTab = 'request'; // افتح تاب vacation
        this.candidateRequestService.getcandidateRequestById(this.editData.id).subscribe(res => {
          const data = res.data;
          this.requestForm.patchValue({
            id: data.id,
            vacationId: data.vacationId,
            fromDate: new Date(data.fromDate),
            toDate: new Date(data.toDate),
            candidateId: data.candidateId
          });
        });
      } else {
        this.activeTab = 'permission'; // افتح تاب permission
        this.candidateRequestService.getPermissionRequestById(this.editData.id).subscribe(res => {
          const data = res.data;
          this.permissionForm.patchValue({
            id: data.id,
            permissionId: data.permissionId,
            date: new Date(data.date),
            fromTime: new Date(`1970-01-01T${data.fromTime}`),
            toTime: new Date(`1970-01-01T${data.toTime}`),
            candidateId: data.candidateId
          });
        });
      }
    }
  }

  dateValidator(group: FormGroup) {
    const fromDate = group.get('fromDate')?.value;
    const toDate = group.get('toDate')?.value;

    if (!fromDate || !toDate) {
      return null; // لو واحد منهم فاضي، ما نعملش validate دلوقتي
    }

    const from = new Date(fromDate).getTime();
    const to = new Date(toDate).getTime();

    if (to < from) {
      // To أقل من From → invalid
      return { dateInvalid: true };
    }

    return null; // Valid
  }
  loadDropdowns() {
    this.candidateRequestService.getVacationList().subscribe({
      next: (res) => {
        this.vacations = res.data;
      },
      error: (err) => console.error(err),
    });

    this.candidateRequestService.getPermissionList().subscribe({
      next: (res) => {
        this.permissions = res.data;
      },
      error: (err) => console.error(err),
    });
  }
  saveRequest() {
    // Vacation Requests
    if (this.activeOuterTab !== candidateRequestType.Permission_Request) {
      console.log("Request Form Valid:", this.requestForm.valid, this.requestForm.value);

      if (this.requestForm.valid) {
        const formValue = this.requestForm.value;

        const body: any = {
          CandidateId: this.candidateId ?? null,
          VacationId: formValue.vacationId,
          FromDate: formValue.fromDate ? new Date(formValue.fromDate).toISOString().split('T')[0] : null,
          ToDate: formValue.toDate ? new Date(formValue.toDate).toISOString().split('T')[0] : null
        };

        // لو Edit زود Id
        if (this.editData?.type === 'vacation' && this.editData.id) {
          body.id = this.editData.id;
        }

        console.log(">>> DEBUG - Final Vacation Body Sent <<<");
        console.log(JSON.stringify(body, null, 2));

        this.candidateRequestService.postOrUpdateVacationRequest(body).subscribe({
          next: (res) => {
            console.log("Vacation API Success:", res);
            this.candidateAdded.emit(res.data);
             window.location.reload();
            this.closeDialog();
          },
          error: (err) => console.error("Vacation API Error:", err),
        });
      }
    }

    // Permission Requests
    else {
      console.log("Permission Form Valid:", this.permissionForm.valid, this.permissionForm.value);

      if (this.permissionForm.valid) {
        const formValue = this.permissionForm.value;

        const body: any = {
          CandidateId: this.candidateId ?? null,
          PermissionId: formValue.permissionId,
          Date: formValue.date ? new Date(formValue.date).toISOString().split('T')[0] : null,
          FromTime: formValue.fromTime ? this.formatTime(formValue.fromTime) : null,
          ToTime: formValue.toTime ? this.formatTime(formValue.toTime) : null
        };

        // لو Edit زود Id
        if (this.editData?.type === 'permission' && this.editData.id) {
          body.id = this.editData.id;
        }

        console.log(">>> DEBUG - Final Permission Body Sent <<<");
        console.log(JSON.stringify(body, null, 2));

        this.candidateRequestService.postOrUpdatePermissionRequest(body).subscribe({
          next: (res) => {
            console.log("Permission API Success:", res);
            this.candidateAdded.emit(res.data);
            window.location.reload();
            this.closeDialog();
          },
          error: (err) => console.error("Permission API Error:", err),
        });
      }
    }
  }



  // helper لتحويل Date لـ "HH:mm:ss"
  private formatTime(date: Date): string {
    const d = new Date(date);
    return d.toTimeString().split(' ')[0]; // "HH:mm:ss"
  }


  closeDialog() {
    this.visibleChange.emit(false);
  }


  onDialogHide() {
  if (this.requestForm) {
    this.requestForm.reset();
    this.requestForm.patchValue({
      candidateId: this.candidateId,
    });
  }

  if (this.permissionForm) {
    this.permissionForm.reset();
    this.permissionForm.patchValue({
      candidateId: this.candidateId,
    });
  }
  this.editData = null;
  this.visibleChange.emit(false);
}

}
