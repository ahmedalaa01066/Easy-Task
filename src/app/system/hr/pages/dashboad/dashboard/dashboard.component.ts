import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedService } from 'src/app/core/services/shared.service';
import { HrService } from '../../../services/hr.service';
import { HrDashboardContentComponent } from '../../../components/dashboard/hr-dashboard-content/dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [HrService, SharedService],
  imports: [CommonModule, ButtonModule, TabMenuModule, HrDashboardContentComponent],
})
export class DashboardComponent {}
