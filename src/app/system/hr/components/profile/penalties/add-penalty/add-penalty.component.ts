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
import { HttpClient } from '@angular/common/http';
import { createPenaltiyViewModel } from '../../../../models/interfaces/profile-details-view-model';
import { HrService } from '../../../../services/hr.service';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
@Component({
  selector: 'app-add-penalty',
  templateUrl: './add-penalty.component.html',
  styleUrls: ['./add-penalty.component.css'],
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
export class AddPenaltyComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() penaltyAdded = new EventEmitter<createPenaltiyViewModel>();
  @Input() candidateId!: string;
  penaltyForm: FormGroup;
  totalRecords: number = 0;
  pageNumber: number = 1;
  totalPages: number = 0;
  rows: number = 2;
  constructor(
    private readonly fb: FormBuilder,
    private readonly _hrService: HrService
  ) {
    this.penaltyForm = this.createForm();
  }
  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }
  createForm(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(2)]],
    });
  }
  resetForm() {
    this.penaltyForm.reset();
  }
  onSubmit() {
    if (this.penaltyForm.invalid) {
      this.penaltyForm.markAllAsTouched();
      return;
    }

    const body: createPenaltiyViewModel = {
      ...this.penaltyForm.value,
      candidateId: this.candidateId, // ⬅️ أضيفنا الـ candidateId هنا
    };

    this._hrService.createPenalty(body).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.penaltyAdded.emit(body); // إرسال البيانات للـ parent
          this.visible = false;
          this.visibleChange.emit(false);
          this.resetForm();
          window.location.reload();
        } else {
          console.error('Failed to add penalty', res);
        }
      },
      error: (err) => console.error('Error creating penalty', err),
    });
  }

  cancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }
}
