import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { KPIsinProfileViewModel } from 'src/app/system/hr/models/interfaces/profile-details-view-model';
import { HrService } from 'src/app/system/hr/services/hr.service';
enum KPIType {
  Course = 1,
  Attendance = 2,
  Other = 3,
}
@Component({
  selector: 'app-kpi-profile',
  templateUrl: './kpi-profile.component.html',
  styleUrls: ['./kpi-profile.component.css'],
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
      FileUploadModule,
      PaginatorModule,
    ],
})
export class KpiProfileComponent {
  @Input() candidateId!: string;
kpis: KPIsinProfileViewModel[] = [];

  constructor(private _hrService: HrService) {}

  ngOnInit() {
    if (this.candidateId) {
      this._hrService.getAllKPIsInProfile(this.candidateId).subscribe({
        next: (res: any) => {
          if (res.isSuccess && res.data) {
            this.kpis = res.data;
          }
        },
        error: (err) => console.error(err),
      });
    }
  }

 trackByIndex(index: number, item: any): number {
    return index;
  }
   getTypeName(type: number): string {
    switch (type) {
      case KPIType.Course:
        return 'Course';
      case KPIType.Attendance:
        return 'Attendance';
      case KPIType.Other:
        return 'Other';
      default:
        return 'Unknown';
    }
  }
}

