import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OnChanges, SimpleChanges } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CreatePermissionViewModel } from 'src/app/system/hr/models/interfaces/permissions-vm';
import { PermissionsService } from 'src/app/system/hr/services/Permissions/permissions.service';
export function minLessThanMaxValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const min = group.get('minHours')?.value;
    const max = group.get('maxHours')?.value;

    if (min != null && max != null && min > max) {
      return { minGreaterThanMax: true };
    }

    return null;
  };
}
@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
  ],
})
export class AddPermissionComponent implements OnChanges {
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() permissionSaved = new EventEmitter<void>();

  @Input() permissionData: CreatePermissionViewModel | null = null;

  private _visible: boolean = false;
  permissiomForm: FormGroup;

  constructor(private fb: FormBuilder, private _permissionService: PermissionsService) {
    this.permissiomForm = this.createForm();
  }

  @Input()
  set visible(val: boolean) {
    this._visible = val;
    if (val) {
      // Fill form with existing data if editing
      if (this.permissionData) {
        this.permissiomForm.patchValue({ ...this.permissionData });
      } else {
        this.permissiomForm.reset({
          id: '',
          name: '',
          maxHours: null,
          minHours: null,
          maxRepeatTimes: null,
          maxHoursPerMonth: null,
        });
      }
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        id: [''],
        name: ['', Validators.required],
        maxHours: [null, Validators.required],
        minHours: [null, Validators.required],
        maxRepeatTimes: [null, Validators.required],
        maxHoursPerMonth: [null, Validators.required],
      },
      {
        validators: minLessThanMaxValidator()
      }
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['permissionData'] && this.permissionData) {
      this.permissiomForm.patchValue({ ...this.permissionData });
    }
  }
  onCancel() {
    this.permissiomForm.reset();
    this.permissionData = null;
    this.visibleChange.emit(false);
  }

  onSubmit() {
    if (this.permissiomForm.valid) {
      const payload: CreatePermissionViewModel = this.permissiomForm.value;

      this._permissionService.postOrUpdateCandidate(payload).subscribe({
        next: (res) => {
            this._permissionService.getAllPermissions.emit(); 
          this.permissionSaved.emit()
          this.permissiomForm.reset();
          this.permissionData = null;
          this.visible = false;
          this.visibleChange.emit(false);
          
        },
        error: (err) => {
          console.error('Error saving permission:', err);
        },
      });
    }
  }

  get dialogTitle(): string {
    return this.permissionData ? 'Edit Permission' : 'Create Permission';
  }
}