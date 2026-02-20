import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// PrimeNG
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
import { HrService } from 'src/app/system/hr/services/hr.service';
import { getAnnualProfileViewModel } from 'src/app/system/hr/models/interfaces/profile-details-view-model';

@Component({
  selector: 'app-annual-draw',
  standalone: true,
  templateUrl: './annual-draw.component.html',
  styleUrls: ['./annual-draw.component.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    AvatarModule,
    TagModule,
    DividerModule,
    TooltipModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    PaginatorModule,
  ],
})
export class AnnualDrawComponent implements OnInit {
  @Input() candidateId!: string;

  annualLeave: number = 0; // الأيام المتبقية
  maxLeave: number = 0;    // الحد الأقصى

  constructor(private hrService: HrService) {}

  ngOnInit() {
    if (this.candidateId) {
      this.loadCandidateAnnualLeave(this.candidateId);
    }
  }

loadCandidateAnnualLeave(candidateId: string) {
  this.hrService.getCandidateVacationInProfile(candidateId).subscribe({
    next: (res: any) => {
      const data: getAnnualProfileViewModel = res.data;
      if (data) {
        this.annualLeave = data.remainingDays;
        this.maxLeave = data.maxRequestNum;
      }
    },
    error: (err) => {
      console.error('Error fetching annual leave data:', err);
    },
  });
}


  get percent() {
    return this.maxLeave ? (this.annualLeave / this.maxLeave) * 100 : 0;
  }
}
