import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  allShiftsVM,
  createShiftsVM,
  searchAllShiftsVM,
  Shift,
} from '../../../models/interfaces/attendance-vm';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AttendanceService } from '../../../services/attendance/attendance.service';

@Component({
  selector: 'app-attendance-config',
  templateUrl: './attendance-config.component.html',
  styleUrls: ['./attendance-config.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    CheckboxModule,
    DialogModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
    ToggleButtonModule,
  ],
})
export class AttendanceConfigComponent implements OnInit {
  shifts: allShiftsVM[] = [];
  totalRecords: number = 0;
  pageIndex: number = 1;
  pageSize: number = 50;
  searchText: string = '';
  shiftsPageNumber: number = 1;
  shiftsTotalPages: number = 1;
  showcreateShiftDialog = false;
  showDeleteDialog = false;
  selectedShift: allShiftsVM | null = null;
  createShiftForm!: FormGroup;

  constructor(
    private _attendanceService: AttendanceService,
    private fb: FormBuilder
  ) {
    this.createShiftForm = this.fb.group({
      shiftName: ['', [Validators.required, Validators.minLength(2)]],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
      pauseOption: [false],
      maxPauseDuration: [''],
      marginBefore: [''],
      marginAfter: [''],
    });
  }

  ngOnInit() {
    this.loadShifts(); // لازم نناديها عند بدء الكومبوننت
  }

  loadShifts() {
    const search: searchAllShiftsVM = { SearchText: this.searchText };
    this._attendanceService
      .getAllShifts(search, 'name', true, this.pageIndex, this.pageSize)
      .subscribe({
        next: (res) => {
          this.shifts = res.data.items;
          this.totalRecords = res.data.records ?? 0;

          // حساب صفحات الواجهة
          this.shiftsTotalPages = Math.max(
            1,
            Math.ceil(this.totalRecords / this.pageSize)
          );
          this.shiftsPageNumber = this.pageIndex;
        },
        error: (err) => {
          console.error('Load shifts error', err);
          // ممكن تضيف handling هنا
        },
      });
  }

  shiftsPrevious() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.loadShifts();
    }
  }

  // زر Next
  shiftsNext() {
    if (this.pageIndex < this.shiftsTotalPages) {
      this.pageIndex++;
      this.loadShifts();
    }
  }
  onSearch() {
    this.pageIndex = 1;
    this.loadShifts();
  }

  onPageChange(event: any) {
    this.pageIndex = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.loadShifts();
  }
  onDialogHide() {
    this.showcreateShiftDialog = false;
    this.createShiftForm.reset({
      fromTime: '',
      toTime: '',
      pauseOption: false,
      maxPauseDuration: '',
    });
  }
  togglePause() {
    const ctrl = this.createShiftForm.get('pauseOption');
    if (ctrl) {
      ctrl.setValue(!ctrl.value);
    }
  }
  formatTo12Hour(timeStr: string): string {
    if (!timeStr) return '';

    // لو API بيرجع وقت زي "14:30" أو "14:30:00"
    const [hoursStr, minutesStr] = timeStr.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // لو 0 نخليه 12

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  confirmDeleteShift(shift: allShiftsVM) {
    this.selectedShift = shift;
    this.showDeleteDialog = true;
  }

  deleteShift() {
    if (!this.selectedShift) return;

    this._attendanceService.removeShift(this.selectedShift).subscribe({
      next: () => {
        this.shifts = this.shifts.filter(
          (s) => s.id !== this.selectedShift?.id
        );
        this.selectedShift = null;
        this.showDeleteDialog = false;
      },
      error: (err) => console.error('Error deleting shift', err),
    });
  }
  getAssignPreview(assignList: string[] | null | undefined): {
    text: string;
    remaining: number;
  } {
    if (!assignList || assignList.length === 0)
      return { text: '', remaining: 0 };

    if (assignList.length <= 3) {
      return { text: assignList.join(', '), remaining: 0 };
    }

    const firstThree = assignList.slice(0, 3).join(', ');
    const remaining = assignList.length - 3;
    return { text: firstThree, remaining };
  }

  saveShift() {
    if (this.createShiftForm.invalid) {
      this.createShiftForm.markAllAsTouched();
      return;
    }

    const formValue = this.createShiftForm.value;
    const shift: createShiftsVM = {
      id: this.selectedShift ? this.selectedShift.id : '', // لو Edit نحط ID
      name: formValue.shiftName,
      fromTime: this.formatTimeForApi(formValue.fromTime),
      toTime: this.formatTimeForApi(formValue.toTime),
      PauseOption: formValue.pauseOption,
      maxPauseDuration: formValue.pauseOption
        ? this.formatTimeForApi(formValue.maxPauseDuration)
        : '',
          marginBefore: formValue.marginBefore ? this.formatTimeForApi(formValue.marginBefore) : '',
  marginAfter: formValue.marginAfter ? this.formatTimeForApi(formValue.marginAfter) : ''
    };

    if (this.selectedShift) {
      // Edit
      this._attendanceService.editCourse(shift).subscribe({
        next: () => {
          this.showcreateShiftDialog = false;
          this.loadShifts();
          this.resetForm();
        },
        error: (err) => console.error('Error updating shift', err),
      });
    } else {
      // Create
      this._attendanceService.createShift(shift).subscribe({
        next: () => {
          this.showcreateShiftDialog = false;
          this.loadShifts();
          this.resetForm();
        },
        error: (err) => console.error('Error creating shift', err),
      });
    }
  }

  // دالة لتحويل وقت Angular Calendar إلى ستايل API
  private formatTimeForApi(date: Date | string): string {
    if (!date) return '';
    if (typeof date === 'string') return date; // لو جاي جاهز
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  editShift(record: allShiftsVM) {
    this.showcreateShiftDialog = true;

    this.createShiftForm.patchValue({
      shiftName: record.name,
      fromTime: this.parseApiTime(record.fromTime),
      toTime: this.parseApiTime(record.toTime),
      pauseOption: record.maxPauseDuration ? true : false,
      maxPauseDuration: record.maxPauseDuration
        ? this.parseApiTime(record.maxPauseDuration)
        : '',
         marginBefore: record.marginBefore ? this.parseApiTime(record.marginBefore) : '',
  marginAfter: record.marginAfter ? this.parseApiTime(record.marginAfter) : ''
    });

    // نخزن الـ id عشان نعرف ده تعديل مش إضافة
    this.selectedShift = record;
  }

  private parseApiTime(time: string): Date | null {
    if (!time) return null;

    const [hoursStr, minutesStr] = time.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date;
  }

  private resetForm() {
    this.createShiftForm.reset({
      fromTime: '',
      toTime: '',
      pauseOption: false,
      maxPauseDuration: '',
    });
    this.selectedShift = null;
  }

  // باقي create/edit نفس الكود بس مع API
}
