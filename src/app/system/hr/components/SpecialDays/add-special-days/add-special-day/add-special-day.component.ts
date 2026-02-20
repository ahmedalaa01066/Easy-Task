import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CreateSpecialDayViewModel } from 'src/app/system/hr/models/interfaces/special-days-vm';
import { SpecialDaysService } from 'src/app/system/hr/services/specialDays/special-days.service';

@Component({
  selector: 'app-add-special-day',
  templateUrl: './add-special-day.component.html',
  styleUrls: ['./add-special-day.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class AddSpecialDayComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() specialDayAdded = new EventEmitter<CreateSpecialDayViewModel>();
  @Input() editId: string | null = null;

  specialDayForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private specialDaysService: SpecialDaysService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editId'] && this.editId) {
      this.loadSpecialDay(this.editId);
    }
  }

  private initForm() {
    this.specialDayForm = this.fb.group({
      name: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['',Validators.required],
      isOneDay: [false]
    }, { validators: [this.oneDayValidator, this.dateRangeValidator] });
  }

  private loadSpecialDay(id: string) {
    this.specialDaysService.getSpecialDayById(id).subscribe((res: any) => {
      const day = res.data || res;
      this.specialDayForm.patchValue({
        name: day.name || day.Name,
        fromDate: day.fromDate || day.FromDate,
        toDate: day.toDate || day.ToDate,
        isOneDay: day.isOneDay ?? day.IsOneDay
      });
    });
  }

  oneDayValidator(group: AbstractControl) {
    const isOneDay = group.get('isOneDay')?.value;
    const fromDate = group.get('fromDate')?.value;
    const toDate = group.get('toDate')?.value;
    if (isOneDay && toDate && toDate !== fromDate) {
      return { oneDayError: true };
    }
    return null;
  }

  dateRangeValidator(group: AbstractControl) {
    const fromDate = group.get('fromDate')?.value;
    const toDate = group.get('toDate')?.value;

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (to < from) {
        return { dateRangeError: true };
      }
    }
    return null;
  }

  onSave() {
    if (this.specialDayForm.valid) {
      const payload = this.specialDayForm.value;

      if (this.editId) {
        this.specialDaysService.editSpecialDay({ ...payload, id: this.editId }).subscribe({
          next: () => {
            this.specialDayAdded.emit(payload);
            window.location.reload();
            this.closeDialog();
          }
        });
      } else {
        this.specialDaysService.createSpecialDay(payload).subscribe({
          next: () => {
            this.specialDayAdded.emit(payload);
            window.location.reload();

            this.closeDialog();
          }
        });
      }
    }
  }

  closeDialog() {
    this.specialDayForm.reset({
      name: '',
      fromDate: '',
      toDate: '',
      isOneDay: false
    });
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }


}
