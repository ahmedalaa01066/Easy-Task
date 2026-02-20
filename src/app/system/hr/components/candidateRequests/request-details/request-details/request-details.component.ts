import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CandidateRequestService } from 'src/app/system/hr/services/candidateRequest/candidate-request.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css'],
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
export class RequestDetailsComponent {
  @Input() visible: boolean = false;
  @Input() detailsData: { type: string, id: string } | null = null;

  loading = false;
  request: any;

  constructor(private _service: CandidateRequestService) { }

 ngOnChanges(changes: SimpleChanges): void {
  if (changes['detailsData'] && this.detailsData) {
    this.visible = true;   
    this.loadDetails();
  }
}


  loadDetails() {
    this.loading = true;
    const { type, id } = this.detailsData!;

    const apiCall =
      type === 'vacation'
        ? this._service.getcandidateRequestById(id)
        : this._service.getPermissionRequestById(id);

    apiCall.subscribe((res: any) => {
      this.request = res.data;
      this.loading = false;
    });
  }

  getStatusClass(): string {
    const status = this.request?.vacationRequestType || this.request?.permissionRequestStatus;

    switch (status) {
      case 1:
      case 'Pending':
        return 'pending';
      case 2:
      case 'FirstApproval':
        return 'first-approval';
      case 3:
      case 'SecondApproval':
        return 'second-approval';
      case 4:
      case 'Rejected':
        return 'rejected';
      default:
        return '';
    }
  }

  getStatusLabel(): string {
    const status = this.request?.vacationRequestType || this.request?.permissionRequestStatus;

    switch (status) {
      case 1:
      case 'Pending':
        return 'Pending';
      case 2:
      case 'First Approval':
        return 'First Approval';
      case 3:
      case 'Second Approval':
        return 'Second Approval';
      case 4:
      case 'Rejected':
        return 'Rejected';
      default:
        return '-';
    }
  }


}
