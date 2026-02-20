import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AttendanceService } from '../../../services/attendance/attendance.service';
import { editAttendenceActivationVM } from '../../../models/interfaces/attendance-vm';

@Component({
  selector: 'app-attend-details',
  templateUrl: './attend-details.component.html',
  styleUrls: ['./attend-details.component.css'],
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
    MultiSelectModule,
    CalendarModule,
    DropdownModule,

  ],
})
export class AttendDetailsComponent {
  personId!: string;
  isEditDialogVisible: boolean = false;
  byLocation = true;
  byFirstLogin = false;
  byLoginTime = false;
  user: any = {};
  shifts: any[] = [];
  shiftLogs: any[] = [];
  fromDate: Date | null = null;
  toDate: Date | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  progressPercentage: number = 0;
  workedHours: string = '00:00 Hr';
  attendanceActivation: number | null = null;

  constructor(private route: ActivatedRoute, private _attendenceService: AttendanceService) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.personId = idParam;
      this.loadCandidateDetails();
      this.loadAssignedShifts();
      this.loadAttendenceData();
      this.loadShiftLogs();
      this.loadCandidateActivation();
    }
  }


  loadCandidateDetails() {
    this._attendenceService
      .getCandidateDataByCandidateId(this.personId)
      .subscribe({
        next: (res) => {
          this.user = {
            name: res.data.firstName + res.data.lastName,
            role: res.data.positionName,
            email: res.data.email,
            image: res.data.candidateImage,
          };
        },
        error: (err) => {
          console.error('Error loading shifts', err);
        },
      });
  }

  loadAssignedShifts() {
    this._attendenceService
      .getAllplannedShiftsByCandidateId(this.personId)
      .subscribe({
        next: (res) => {
          this.shifts = res.data.map((s: any) => ({
            ...s,
            startDate: new Date(s.startDate),
            endDate: new Date(s.endDate),
          }));
        },
        error: (err) => {
          console.error('Error loading shifts', err);
        },
      });
  }


  loadAttendenceData() {
    this._attendenceService
      .getAttendeceCircleByCandidateId(this.personId)
      .subscribe({
        next: (res) => {
          const data = res.data;
          let totalShiftMs = this.parseTimeToMs(data?.totalShiftTime);
          let pauseMs = this.parseTimeToMs(data?.totalPauseDuration);
          let startMs = this.parseTimeToMs(data?.actualStartDate);
          let endMs = data?.actualEndDate
            ? this.parseTimeToMs(data?.actualEndDate)
            : this.getNowMs();
          let workedMs = 0;
          if (startMs && endMs) {
            workedMs = (endMs - startMs) - pauseMs;
          }
          if (totalShiftMs > 0 && workedMs > 0) {
            this.progressPercentage = Math.min(
              (workedMs / totalShiftMs) * 100,
              100
            );
          } else {
            this.progressPercentage = 0;
          }
          if (workedMs > 0) {
            const hours = workedMs / (1000 * 60 * 60);
            this.workedHours = `${hours.toFixed(2)} Hr`;
          } else {
            this.workedHours = '00.00 Hr';
          }
        },
        error: (err) => {
          console.error('Error loading attendance circle', err);
        },
      });
  }

  parseTimeToMs(timeStr: string | null): number {
    if (!timeStr) return 0;
    const [h, m, s] = timeStr.split(':').map(Number);
    return ((h * 3600) + (m * 60) + s) * 1000;
  }
  getNowMs(): number {
    const now = new Date();
    return (
      now.getHours() * 3600 * 1000 +
      now.getMinutes() * 60 * 1000 +
      now.getSeconds() * 1000
    );
  }



  loadShiftLogs() {
    const searchModel = {
      CandidateId: this.personId,
      From: this.fromDate,
      TO: this.toDate
    };

    this._attendenceService
      .getAllShiftsDetailsForCandidate(searchModel, 'date', true, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.shiftLogs = res.data.items.map((x: any) => ({
            log: x.log,
            time: this.formatTo12Hour(x.time),
            date: x.date
          }));
        },
        error: (err) => {
          console.error('Error loading shift logs', err);
        },
      });
  }

  formatTo12Hour(time: string): string {
    if (!time) return '';

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  get totalPages(): number {
    return Math.ceil(this.shiftLogs.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }



  onUnassignShift(shift: any) {
    const body = {
      candidateId: this.personId,
      shiftId: shift.shiftId
    };

    this._attendenceService.unassigneShift(body).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadAssignedShifts();
        }
      },
      error: (err) => {
        console.error('Error unassigning shift:', err);
      }
    });
  }


  startPauseShift(shift: any) {
    const body = { attendanceId: shift.attendanceId };

    this._attendenceService.startPause(body).subscribe({
      next: (res: any) => {
        if (res?.data?.pauseID) {
          shift.pauseId = res.data.pauseID;
        }
      },
      error: (err) => {
        console.error('Error starting pause:', err);
        delete shift.pauseId;
      }
    });
  }

  stopPauseShift(shift: any) {
    const body = { id: shift.pauseId };

    delete shift.pauseId;

    this._attendenceService.stopPause(body).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Error stopping pause:', err);
        shift.pauseId = body.id;
      }
    });
  }


  openEditDialog() {
    this._attendenceService.getCandidateDataByCandidateId(this.personId).subscribe({
      next: (res) => {
        const data = res.data;

        this.user = {
          name: res.data.firstName + res.data.lastName,
          role: data.positionName,
          email: data.email,
          image: data.imageUrl
        };
        this.loadCandidateActivation();
        this.isEditDialogVisible = true;
      },
      error: (err) => console.error('Error loading candidate data', err)
    });
  }

  loadCandidateActivation() {
    this._attendenceService.getCandidateAttendenceActivation(this.personId).subscribe({
      next: (res) => {
        const data = res.data;
        this.attendanceActivation = data.attendanceActivation;
      },
      error: (err) => console.error('Error loading candidate activation', err)
    });
  }



  onCheckboxChange(value: number, event: any) {
    if (event.target.checked) {
      this.attendanceActivation = value;
    } else {
      this.attendanceActivation = null;
    }
  }

  saveActivation() {
    const body: editAttendenceActivationVM = {
      id: this.personId,
      attendanceActivation: this.attendanceActivation
    };

    this._attendenceService.editAttendenceActivation(body).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.attendanceActivation = body.attendanceActivation;
          this.isEditDialogVisible = false;
        }
      },
      error: (err) => console.error('Error saving activation', err),
    });
  }



}
