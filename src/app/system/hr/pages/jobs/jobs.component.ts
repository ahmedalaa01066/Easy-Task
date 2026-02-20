import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { AddManagementComponent } from '../../components/management/add-management/add-management.component';
import { ManagementListComponent } from '../../components/management/management-list/management-list.component';
import { JobListComponent } from '../../components/job/job-list/job-list.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  standalone: true,
    imports: [CommonModule, ButtonModule, TabMenuModule, FormsModule,JobListComponent],
  })
export class JobsComponent {
  searchTerm: string = ''; 

}
