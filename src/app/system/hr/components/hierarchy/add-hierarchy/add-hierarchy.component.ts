import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient } from '@angular/common/http';

import { InputNumberModule } from 'primeng/inputnumber';
import { CreateHierarchyViewModel } from '../../../models/interfaces/hierarchy-view-model';
import { HrService } from '../../../services/hr.service';
import { HierarchyService } from '../../../services/hierarchy/hierarchy.service';

@Component({
  selector: 'app-add-hierarchy',
  templateUrl: './add-hierarchy.component.html',
  styleUrls: ['./add-hierarchy.component.css'],
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
    InputNumberModule
  ],
})
export class AddHierarchyComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() hierarchyAdded = new EventEmitter<CreateHierarchyViewModel>();

  hierarchyForm: FormGroup;
  nextLevel: number;
  constructor(
    private readonly fb: FormBuilder,
    private readonly _hrService: HrService,
    private _hierarchyService: HierarchyService
  ) {
    this.hierarchyForm = this.createForm();
  }
  ngOnInit() {
    this.getNextLevel();
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
      sequence: [{ value: '', disabled: true }]
    });
  }

  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm() {
    this.hierarchyForm.get('name')?.reset();
  }
  onSubmit() {
    if (this.hierarchyForm.valid) {
      const formData = this.hierarchyForm.getRawValue();

      const payload: CreateHierarchyViewModel = {
        id: '',
        name: formData.name,
        sequence: formData.sequence
      };

      this._hierarchyService.createHierarchy(payload).subscribe({
        next: () => {
          this.hierarchyAdded.emit(payload);
          this.resetForm();
          this.onDialogHide();
          window.location.reload()
        },
        error: (err) => {
          console.error('Error saving management:', err);
        },
      });
    } else {
      console.warn('Form invalid');
      this.hierarchyForm.markAllAsTouched();
    }
  }


  cancel() {
    this.onDialogHide();
  }


  getNextLevel() {
    this._hierarchyService.getNextLevel().subscribe({
      next: (response: any) => {
        this.nextLevel = response.data.sequence;
        this.hierarchyForm.get('sequence')?.setValue(this.nextLevel);
        this.hierarchyForm.get('sequence')?.updateValueAndValidity();
      },
    });
  }


  customSequenceValidator = (minValue: number) => {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value !== null && value <= minValue) {
        return { sequenceTooLow: true };
      }
      return null;
    };
  };

}
