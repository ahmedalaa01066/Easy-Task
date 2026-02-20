import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { EditHierarchyinProfileViewModel } from '../../../../models/interfaces/profile-details-view-model';
import { HrService } from '../../../../services/hr.service';

@Component({
  selector: 'app-edit-hierarachy',
  templateUrl: './edit-hierarachy.component.html',
  styleUrls: ['./edit-hierarachy.component.css'],
  standalone: true,
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
export class EditHierarachyComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() hierarchyEdit = new EventEmitter<EditHierarchyinProfileViewModel>();
  @Input() candidateId!: string;
  @Input() levelId!: string;   

  hierarchyForm!: FormGroup;
  levels: any[] = [];
  loadingLevels = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly _hrService: HrService
  ) {
    this.hierarchyForm = this.fb.group({
      levelId: [null, Validators.required],
    });
  }

  // 🟢 كل مرة الـ popup يتفتح نحمّل الـ Levels
 ngOnChanges(changes: SimpleChanges): void {
  if (changes['visible']?.currentValue === true) {
    this.loadLevels();

    if (this.levelId) {
      this.hierarchyForm.patchValue({
        levelId: this.levelId   // 👈 يضبط القيمة من الـ parent
      });
    }
  }
}


  loadLevels() {
    this.loadingLevels = true;
    this._hrService.getLevels().subscribe({
      next: (res: any) => {
        this.levels =
          res?.data?.map((x: any) => ({
            label: x.name, // ← غيريها حسب response
            value: x.id,   // ← غيريها حسب response
          })) || [];
        this.loadingLevels = false;
      },
      error: () => (this.loadingLevels = false),
    });
  }

  cancel() {
    this.visibleChange.emit(false);
  }

onSubmit() {
  if (this.hierarchyForm.invalid) {
    this.hierarchyForm.markAllAsTouched();
    return;
  }

 const body: EditHierarchyinProfileViewModel = {
  id: this.candidateId,
  levelId: this.hierarchyForm.value.levelId, // القيمة المختارة أو المعدلة
};


  // 🟢 استدعاء API مباشر
  this._hrService.EditHierarchyinProfile(body).subscribe({
    next: (res: any) => {
      if (res.isSuccess) {
        // ✅ لو عايزة تعرض Message أو Toast
        console.log('Level updated successfully');
      }
      this.visibleChange.emit(false); // يقفل الـ dialog
              window.location.reload();

    },
    error: (err) => {
      console.error('Error updating hierarchy level', err);
    },
  });
}

}
