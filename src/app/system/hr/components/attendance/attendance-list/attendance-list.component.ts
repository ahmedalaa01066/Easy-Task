import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AttendanceTabType } from '../../../models/enum/attendance-tab';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { HrService } from '../../../services/hr.service';
import { AttendanceService } from '../../../services/attendance/attendance.service';
import { Router, RouterModule } from '@angular/router';
import { AttendDetailsComponent } from '../attend-details/attend-details.component';
import { DayStatus } from '../../../models/enum/day-status';
import { candidatesWeeklyStatusVM } from '../../../models/interfaces/attendance-vm';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css'],
  encapsulation: ViewEncapsulation.None,
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
    RouterModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    AttendDetailsComponent,
  ],
})
export class AttendanceListComponent {
  @Input() activeTab: number = AttendanceTabType.Attendance;

  // UI States
  showAssignDialog = false;

  // Filters & form values
  attendanceSearchText = '';
  assignationSearchText = '';
  selectedDepartments: any[] = [];
  selectedCandidates: any[] = [];
  selectedShift: string | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  today: Date = new Date();
  startDateError: string = '';
  endDateError: string = '';

  // Data sources
  departments: any[] = [];
  candidates: any[] = [];
  shifts: any[] = [];
  assignationRecords: any[] = [];

  // Pagination - Assignation
  assignationPageNumber = 1;
  assignationRows = 50;
  assignationTotalRecords = 0;
  assignationTotalPages = 1;

  // Pagination - Shifts
  shiftsPageNumber = 1;
  shiftsRows = 50;
  shiftsTotalRecords = 0;
  shiftsTotalPages = 1;

  attendanceRecords: candidatesWeeklyStatusVM[] = [];

  constructor(
    private hrService: HrService,
    private attendanceService: AttendanceService,
    private router: Router
  ) {}

  // -------------------------
  // Lifecycle
  // -------------------------
  ngOnChanges() {
    if (this.isCandidatesAssignationTab) {
      this.loadCandidatesAssignation();
    }
    if (this.isAttendanceTab) {
      this.loadAttendance();
    }
  }

  // -------------------------
  // Computed properties
  // -------------------------
  get isAttendanceTab(): boolean {
    return this.activeTab === AttendanceTabType.Attendance;
  }

  get isCandidatesAssignationTab(): boolean {
    return this.activeTab === AttendanceTabType.CandidatesAssignation;
  }

  get filteredRecords() {
    if (!this.attendanceSearchText.trim()) return this.attendanceRecords;
    return this.attendanceRecords.filter(
      (r) =>
        r.candidateName
          .toLowerCase()
          .includes(this.attendanceSearchText.toLowerCase()) ||
        r.departmentName
          .toLowerCase()
          .includes(this.attendanceSearchText.toLowerCase())
    );
  }

  // -------------------------
  // Assignation
  // -------------------------
  loadCandidatesAssignation() {
    const searchViewModel = { SearchText: this.assignationSearchText };
    this.attendanceService
      .getCandidatesAssignation(
        searchViewModel,
        'name',
        true,
        this.assignationPageNumber,
        this.assignationRows
      )
      .subscribe((res: any) => {
        const data = res.data || res;
        this.assignationTotalRecords = data.records || 0;
        this.assignationTotalPages = data.pages || 1;

        this.assignationRecords = (data.items || []).map((item: any) => ({
          id: item.candidateId,
          name: item.name,
          department: item.departmentName,
          shift: `${item.shiftName} ${this.formatTimeTo12Hour(
            item.fromTime
          )} - ${this.formatTimeTo12Hour(item.toTime)}`,
          activation: this.getActivationText(item.attendanceActivation),
        }));
      });
  }

  saveAssignation() {
    if (
      !this.startDate ||
      !this.endDate ||
      !this.selectedCandidates.length ||
      !this.selectedShift
    ) {
      return;
    }

    const body = {
      startDate: this.startDate,
      endDate: this.endDate,
      candidateIds: this.selectedCandidates,
      shiftId: this.selectedShift,
    };

    this.attendanceService.assignCandidateToShift(body).subscribe({
      next: (res: any) => {
        this.showAssignDialog = false;
        this.loadCandidatesAssignation(); // refresh table
      },
      error: (err) => {
        console.error('Error while saving assignation', err);
      },
    });
  }

  // -------------------------
  // Load Data
  // -------------------------
  loadDepartments() {
    this.hrService.getDepartments().subscribe((res: any) => {
      this.departments = res.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    });
  }

  loadShifts() {
    this.hrService.getShifts().subscribe((res: any) => {
      const data = res.data || res;
      this.shifts = data.map((s: any) => ({
        label: s.name, // أو s.shiftName حسب الـ API
        value: s.id, // أو s.shiftId حسب الـ API
      }));
    });
  }

  loadCandidates() {
    this.hrService.selectCandidates().subscribe((res: any) => {
      const data = res.data || res;
      this.candidates = data.map((c: any) => ({
        label: c.name,
        value: c.id,
      }));
    });
  }

  loadDepartmentsByManagementIds(managementIds: string[]) {
    if (!managementIds?.length) {
      this.departments = [];
      this.candidates = [];
      return;
    }
    this.hrService
      .getDepartmentsByManagementIds(managementIds, null)
      .subscribe((res: any) => {
        this.departments = res.data.map((item: any) => ({
          label: item.name,
          value: item.id,
          styleClass: item.assignment === 2 ? 'partial-assigned-option' : null,
        }));
        this.candidates = [];
      });
  }

  loadCandidatesByDepartmentIds(departmentIds: string[]) {
    if (!departmentIds?.length) {
      this.candidates = [];
      return;
    }
    this.hrService
      .getCandidatesByDepartmentIds(departmentIds, null)
      .subscribe((res: any) => {
        this.candidates = res.data.map((item: any) => ({
          label: item.name,
          value: item.id,
          styleClass: item.assignment === 2 ? 'partial-assigned-option' : null,
        }));
      });
  }

  // -------------------------
  // Helpers
  // -------------------------
  getActivationText(value: number): string {
    switch (value) {
      case 1:
        return 'By First Login';
      case 2:
        return 'By Location';
      case 3:
        return 'By Login Time';
      default:
        return 'Unknown';
    }
  }

  formatTimeTo12Hour(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }

  getStatusClass(status: number): string {
    const statusName = this.getStatusName(status); // ترجعي الاسم من الـ enum

    switch (statusName) {
      case 'WFH':
        return 'status-wfh';
      case 'Office':
        return 'status-office';
      case 'Leave':
        return 'status-leave';
      case 'Annual':
        return 'status-annual';
      case 'Weekend':
        return 'status-weekend';
      case 'Absent':
        return 'status-absent';
      default:
        return '';
    }
  }

  filterBy(period: string) {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    // 🔹 بداية الأسبوع الحالي = الأحد
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    switch (period) {
      case 'today':
        this.startDate = today;
        this.endDate = today;
        break;

      case 'thisWeek':
        this.startDate = startOfWeek;
        this.endDate = today;
        break;

      case 'lastWeek':
        const lastWeekStart = new Date(startOfWeek);
        lastWeekStart.setDate(startOfWeek.getDate() - 7);
        const lastWeekEnd = new Date(startOfWeek);
        lastWeekEnd.setDate(startOfWeek.getDate() - 1);
        this.startDate = lastWeekStart;
        this.endDate = lastWeekEnd;
        break;

      case 'last2Weeks':
        // 🟢 نبدأ من أسبوعين قبل بداية الأسبوع الحالي (14 يوم قبل startOfWeek)
        const last2WeeksStart = new Date(startOfWeek);
        last2WeeksStart.setDate(startOfWeek.getDate() - 14);

        // 🔵 ننتهي بنهاية الأسبوع الماضي (يوم السبت قبل startOfWeek)
        const last2WeeksEnd = new Date(startOfWeek);
        last2WeeksEnd.setDate(startOfWeek.getDate() - 1);

        this.startDate = last2WeeksStart;
        this.endDate = last2WeeksEnd;
        break;
    }

    // 🔄 تحميل البيانات بالتواريخ الجديدة
    this.loadAttendance();
  }
  // -------------------------
  // Pagination Actions
  // -------------------------
  assignationPrevious() {
    if (this.assignationPageNumber > 1) {
      this.assignationPageNumber--;
      this.loadCandidatesAssignation();
    }
  }

  assignationNext() {
    if (this.assignationPageNumber < this.assignationTotalPages) {
      this.assignationPageNumber++;
      this.loadCandidatesAssignation();
    }
  }

  shiftsPrevious() {
    if (this.shiftsPageNumber > 1) {
      this.shiftsPageNumber--;
      this.loadAttendance();
    }
  }

  shiftsNext() {
    if (this.shiftsPageNumber < this.shiftsTotalPages) {
      this.shiftsPageNumber++;
      this.loadAttendance();
    }
  }

  // -------------------------
  // Dialog actions
  // -------------------------
  openAssignCandidate() {
    this.showAssignDialog = true;

    // Reset values
    this.startDate = null;
    this.endDate = null;
    this.selectedDepartments = [];
    this.selectedCandidates = [];
    this.selectedShift = null;
    this.candidates = [];
    // Load dropdown data
    this.loadDepartments();
    this.loadShifts();
  }

  goToAttendDetails(id: string) {
    this.router.navigate(['/hr/attendance/attend-details', id]);
  }

  // -------------------------
  // Mock Data
  // -------------------------

  getStatusName(status: number): string {
    switch (status) {
      case DayStatus.Office:
        return 'Office';
      case DayStatus.WFH:
        return 'WFH';
      case DayStatus.Annual:
        return 'Annual';
      case DayStatus.Weekend:
        return 'Weekend';
      case DayStatus.SpecialDay:
        return 'Special Day';
      case DayStatus.Absent:
        return 'Absent';
      default:
        return 'Unknown';
    }
  }
  loadAttendance() {
    const searchViewModel = {
      SearchText: this.attendanceSearchText,
      StartDate: this.startDate,
      EndDate: this.endDate,
    };

    this.attendanceService
      .getCandidatesWeeklyStatus(
        searchViewModel,
        'candidateName',
        true,
        this.shiftsPageNumber, // ✅ استخدم الصفحة الحالية
        this.shiftsRows
      )
      .subscribe({
        next: (res: any) => {
          const data = res.data || res;

          // ✅ احفظ بيانات الـ pagination
          this.shiftsTotalRecords = data.records || 0;
          this.shiftsTotalPages = data.pages || 1;

          this.attendanceRecords = (data.items || []).map((item: any) => {
            const days: any = {};

            if (item.weeklyStatuses && Array.isArray(item.weeklyStatuses)) {
              item.weeklyStatuses.forEach((ws: any) => {
                days[ws.dayName] = this.getStatusName(ws.status);
              });
            }

            return {
              id: item.candidateId,
              name: item.candidateName,
              departmentName: item.departmentName,
              days: days,
              weeklyStatuses: item.weeklyStatuses,
            };
          });
        },
        error: (err) => {
          console.error('Error loading attendance:', err);
        },
      });
  }

  getDays(record: any) {
    return record.weeklyStatuses || [];
  }

  validateDates() {
    this.startDateError = '';
    this.endDateError = '';

    if (this.startDate && this.startDate < this.today) {
      this.startDateError = 'Start date cannot be in the past';
      this.startDate = null;
    }

    if (this.endDate && this.startDate && this.endDate <= this.startDate) {
      this.endDateError = 'End date must be after start date';
      this.endDate = null;
    }
  }

  isFormValid(): boolean {
    // لازم startDate و endDate يكونوا موجودين
    if (!this.startDate || !this.endDate) return false;

    // startDate مينفعش يكون في الماضي
    if (this.startDate < this.today) return false;

    // endDate مينفعش يكون قبل startDate
    if (this.endDate <= this.startDate) return false;

    // لازم يكون فيه مرشحين مختارين
    if (!this.selectedCandidates || this.selectedCandidates.length === 0)
      return false;

    // لازم يكون فيه شفت مختار
    if (!this.selectedShift) return false;

    return true;
  }
}
