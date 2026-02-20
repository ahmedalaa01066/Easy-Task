import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedService } from 'src/app/core/services/shared.service';
import { HrService } from '../../services/hr.service';
import { AttendanceTabType } from '../../models/enum/attendance-tab';
import { MenuItem } from 'primeng/api';
import { AttendanceListComponent } from '../../components/attendance/attendance-list/attendance-list.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  standalone: true,
  providers: [HrService, SharedService],
  imports: [CommonModule, ButtonModule, TabMenuModule ,AttendanceListComponent],
})
export class AttendanceComponent {
  // Current active tab
  activeTab: AttendanceTabType = AttendanceTabType.Attendance;

  tabItems: MenuItem[] = [
    {
      label: 'Attendance',
      id: AttendanceTabType.Attendance.toString(),
      command: () => this.onTabChange(AttendanceTabType.Attendance),
    },
    {
      label: 'Candidates Assignation',
      id: AttendanceTabType.CandidatesAssignation.toString(),
      command: () => this.onTabChange(AttendanceTabType.CandidatesAssignation),
    }
   
  ];
  /**
   * Handle tab change
   * @param tabType - The selected tab type
   */
  constructor(
    
    private readonly _hrService: HrService,
    private readonly _sharedService: SharedService
  ) {}

  onTabChange(tabType: AttendanceTabType): void {
    this.activeTab = tabType;
    // Add your tab change logic here
  }
}
