import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import {
  AttendanceProfileViewModel,
  searchAttendanceProfileViewModel,
} from 'src/app/system/hr/models/interfaces/profile-details-view-model';
import { HrService } from 'src/app/system/hr/services/hr.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    AvatarModule,
    TagModule,
    DividerModule,
    TooltipModule,
    AvatarModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    PaginatorModule,
  ],
})
export class AttendanceListComponent implements OnInit {
  attendance: AttendanceProfileViewModel[] = [];
  totalRecords: number = 0;
  pageSize: number = 7;
  pageIndex: number = 0;
  pageNumber: number = 1;
  totalPages: number = 1;
  orderBy: string = 'ActualStartDate';
  isAscending: boolean = true;
  @Input() candidateId!: string;
  rows: number = 50;
  showFilterDialog: boolean = false;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  inputsDisabled: boolean = false;
originalFromDate: Date | null = null;
originalToDate: Date | null = null;
originalInputsDisabled: boolean = false;

  constructor(private hrService: HrService) {}

  ngOnInit() {
    this.loadAttendances();
  }

  loadAttendances() {
    const filter: searchAttendanceProfileViewModel = {
      From: this.fromDate || null,
      To: this.toDate || null,
      CandidateId: this.candidateId,
    };

    this.hrService
      .getAttendancesInProfile(
        filter,
        this.orderBy,
        this.isAscending,
        this.pageNumber,
        this.rows,
        this.candidateId
      )
      .subscribe((res: any) => {
        this.attendance = res.data.items || [];
        this.totalRecords = res.data.records || this.attendance.length;
        this.totalPages =
          res.data.pages || Math.ceil(this.totalRecords / this.rows);
        this.pageNumber = res.data.pageIndex || this.pageNumber;
        this.inputsDisabled = false;
      });
  }

  goToPrevious() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadAttendances();
    }
  }

  goToNext() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadAttendances();
    }
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.rows = event.rows;
    this.loadAttendances();
  }

  getDayName(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[date.getDay()];
  }
  // private dayOrder = [
  //   'Saturday',
  //   'Sunday',
  //   'Monday',
  //   'Tuesday',
  //   'Wednesday',
  //   'Thursday',
  //   'Friday',
  // ];

  // sortAttendanceByDay() {
  //   this.attendance.sort((a, b) => {
  //     const dayA = this.getDayName(a.actualStartDate);
  //     const dayB = this.getDayName(b.actualStartDate);
  //     return this.dayOrder.indexOf(dayA) - this.dayOrder.indexOf(dayB);
  //   });
  // }

  convertTo12HourFormat(time: string): string {
    if (!time) return '';
    const parts = time.split(':');
    if (parts.length < 2) return time;

    let hour = parseInt(parts[0], 10);
    const minute = parts[1].padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  }

  getDuration(fromTime: string, toTime: string): string {
    if (!fromTime || !toTime) return '00:00';
    // فصل الساعات والدقائق
    const fromParts = fromTime.split(':').map(Number);
    const toParts = toTime.split(':').map(Number);
    // حساب الوقت بالدقائق
    const fromMinutes = fromParts[0] * 60 + fromParts[1];
    const toMinutes = toParts[0] * 60 + toParts[1];
    let diff = toMinutes - fromMinutes;
    if (diff < 0) diff += 24 * 60; // لو مر اليوم
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  /** تعيين فترة سريعة وزرار Inputs disabled */
  setQuickPeriod(period: 'lastWeek' | 'thisWeek' | 'last2Weeks') {
    const today = new Date();
    let from: Date;
    let to: Date;
    // helper لحساب أول يوم السبت للأسبوع الحالي أو الماضي
    const getSaturday = (date: Date, weeksBack: number = 0) => {
      const day = date.getDay(); // 0 = Sunday, 6 = Saturday
      const diff = day === 6 ? 0 : 6 - day; // عدد الأيام للوصول للسبت
      const saturday = new Date(date);
      saturday.setDate(date.getDate() + diff - weeksBack * 7);
      return saturday;
    };
    if (period === 'lastWeek') {
      from = getSaturday(today, 1); // السبت الماضي
      to = new Date(from);
      to.setDate(from.getDate() + 6); // نهاية الأسبوع (جمعة)
    } else if (period === 'thisWeek') {
      from = getSaturday(today, 0); // السبت الحالي
      to = new Date(from);
      to.setDate(from.getDate() + 6); // نهاية الأسبوع
    } else if (period === 'last2Weeks') {
      from = getSaturday(today, 2); // السبت قبل أسبوعين
      to = new Date(from);
      to.setDate(from.getDate() + 13); // يغطي أسبوعين كاملين
    }
    this.fromDate = from;
    this.toDate = to;
    this.inputsDisabled = true;
  }

  applyFilter() {
  if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
    alert('From Date cannot be after To Date');
    return;
  }

  this.pageNumber = 1;
  this.showFilterDialog = false;
  this.inputsDisabled = false;
  this.loadAttendances();
}

  openFilterDialog() {
  this.originalFromDate = this.fromDate;
  this.originalToDate = this.toDate;
  this.originalInputsDisabled = this.inputsDisabled;
  this.showFilterDialog = true;
}
cancelFilter() {
  this.fromDate = this.originalFromDate;
  this.toDate = this.originalToDate;
  this.inputsDisabled = this.originalInputsDisabled;
  this.showFilterDialog = false;
}

}
