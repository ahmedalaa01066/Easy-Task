import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HrService } from '../../../services/hr.service';
import { JobService } from '../../../services/job/job.service';

@Component({
  selector: 'app-add-new-position',
  templateUrl: './add-new-position.component.html',
  styleUrls: ['./add-new-position.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
})
export class AddNewPositionComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() jobToEdit: any = null;
  @Output() positionAdded = new EventEmitter<any>();
  positionForm: FormGroup;
  managements: any[] = [];
  constructor(
  private readonly fb: FormBuilder,
  private readonly _hrService: HrService,
  private readonly _jobService: JobService
) {
  this.positionForm = this.createForm();
}

  ngOnInit() {
    this.loadManagements();
  }

  loadManagements() {
    this._hrService.getManagementList().subscribe({
      next: (res: any) => {
        this.managements = res.data;
      },
      error: (err) => {
        console.error('Error loading managements:', err);
      },
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      managementId: ['', Validators.required],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
    });
  }

  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

 resetForm() {
  this.positionForm.reset({
    name: '',
    jobCode: '',
    managementId: '',
    description: '',
  });
}


  cancel() {
    this.onDialogHide();
  }
  ngOnChanges() {
  if (this.jobToEdit) {
    this.positionForm.patchValue({
      name: this.jobToEdit.name,
      managementId: this.jobToEdit.managementId,
      description: this.jobToEdit.description,
    });
  } else {
    this.resetForm();
  }
}

 onSubmit() {
  if (this.positionForm.valid) {
    const formValue = this.positionForm.value;

    const body = {
      id: this.jobToEdit?.id || '', // لو edit
      name: formValue.name,
      managementId: formValue.managementId,
      jobCode: formValue.jobCode,
      description: formValue.description,
    };

    const request$ = this.jobToEdit
      ? this._jobService.editJob(body)   // 🟢 Edit mode
      : this._jobService.creatJob(body); // 🟢 Create mode

    request$.subscribe({
      next: (res: any) => {
        if (res.isSuccess || res.success) {
          const job = res.data || body;
          this.positionAdded.emit(job);
          this.onDialogHide();
        } else {
          console.error('Operation failed:', res.message || res.error);
        }
      },
      error: (err) => {
        console.error('Error saving job:', err);
      },
    });
  }
}


}
