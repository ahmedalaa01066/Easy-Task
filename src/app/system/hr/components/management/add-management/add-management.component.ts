import { ManagementService } from './../../../services/management/management.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { HrService } from '../../../services/hr.service';
import { CreateManagementViewModel } from '../../../models/interfaces/management-view-models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-management',
  templateUrl: './add-management.component.html',
  styleUrls: ['./add-management.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    DropdownModule,
  ],
})
export class AddManagementComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() managementAdded = new EventEmitter<CreateManagementViewModel>();
  currentStep: number = 0;
managers: { id: string; name: string }[] = [];

  departments: string[] = [];
  managementForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly _hrService: HrService,
    private _managementService:ManagementService
  ) {
    this.managementForm = this.createForm();
  }
  ngOnInit(): void {
  this.loadManagers();
}

loadManagers() {
  this._hrService.getManagers().subscribe({
    next: (response: any) => {
      this.managers = response.data;
    },
    error: (err) => {
      console.error('Error loading managers:', err);
    }
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
       managerId: [null, Validators.required],
      departments: this.fb.array([]),
    });
  }
  get departmentsFormArray() {
    return this.managementForm.get('departments') as FormArray;
  }

  addDepartment() {
    this.departmentsFormArray.push(this.fb.control('', Validators.required));
  }
  
  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.departments = [];
    this.resetForm();
  }

  resetForm() {
    this.currentStep = 0;
    this.managementForm.reset();
    this.departmentsFormArray.clear();
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

 onSubmit() {
  if (this.managementForm.valid) {
    const formData = this.managementForm.value;

    const payload: CreateManagementViewModel = {
      id: '',
      name: formData.name,
      managerId: formData.managerId, // ✅ إضافة مدير
      departmentName: formData.departments.filter(
        (department: string) => department && department.trim() !== ''
      ),
    };

    this._managementService.createManagement(payload).subscribe({
      next: () => {
        this.managementAdded.emit(payload);
        this.resetForm();
        this.onDialogHide();
      },
      error: (err) => {
        console.error('Error saving management:', err);
      },
    });
  } else {
    this.managementForm.markAllAsTouched();
  }
}


  cancel() {
    this.onDialogHide();
  }
}
