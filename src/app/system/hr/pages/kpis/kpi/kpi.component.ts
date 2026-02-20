import { Component } from '@angular/core';
import { KpiListComponent } from '../../../components/kpis/kpi-list/kpi-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css'],
    standalone: true,
    imports: [CommonModule, ButtonModule, TabMenuModule, FormsModule, KpiListComponent],
})
export class KpiComponent {
  searchTerm: string = ''; 

}
