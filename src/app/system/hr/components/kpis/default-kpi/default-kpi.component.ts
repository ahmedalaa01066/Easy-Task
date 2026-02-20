import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { KpiService } from '../../../services/kpi/kpi.service';
import { KpiType } from '../../../models/enum/kpi-type';
import { defaultKpiViewModel, deleteDefaultKpiViewModel } from '../../../models/interfaces/kpi-view-model';

@Component({
  selector: 'app-default-kpi',
  templateUrl: './default-kpi.component.html',
  styleUrls: ['./default-kpi.component.css'],
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
    DropdownModule,
  ],
})
export class DefaultKpiComponent {
  defaultKpis: defaultKpiViewModel[] = [];
  totalRecords: number = 0;
  rows: number = 50;
  pageIndex: number = 1;
  loading: boolean = true;
  KpiType = KpiType;
  showDeleteDialog: boolean = false;
selectedItem: defaultKpiViewModel | null = null;
  displayDialog: boolean = false;
  newKpi: any = {
    name: '',
    type: null,
    percentage: null,
  };

  typeOptions = [
    { label: 'Course', value: KpiType.Course },
    { label: 'Attendance', value: KpiType.Attendance },
    { label: 'Other', value: KpiType.Other },
  ];
  private cache: { [key: number]: defaultKpiViewModel[] } = {};

  constructor(private _KpiService: KpiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(pageIndex: number = 1) {
    if (this.cache[pageIndex]) {
      this.defaultKpis = this.cache[pageIndex];
      this.pageIndex = pageIndex;
      return;
    }

    this.loading = true;
    this._KpiService
      .getDefaultKPIs('name', true, pageIndex, this.rows)
      .subscribe({
        next: (res: any) => {
          this.defaultKpis = res.data.items;
          this.totalRecords = res.data.records;
          this.pageIndex = res.data.pageIndex;
          this.rows = res.data.pageSize;
          this.cache[pageIndex] = res.data.items;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  onPageChange(event: any) {
    this.pageIndex = event.page + 1;
    this.rows = event.rows;
    this.loadData(this.pageIndex);
  }

  calculateTotalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  saveKpi() {
    if (!this.newKpi.name || !this.newKpi.type || !this.newKpi.percentage) {
      return;
    }

    const body = {
      name: this.newKpi.name,
      type: this.newKpi.type,
      percentage: this.newKpi.percentage,
    };

    this._KpiService.createDefaultKPI(body).subscribe({
      next: (res) => {
        console.log('✅ KPI created:', res);
        this.displayDialog = false;
        this.loadData();
        this.newKpi = { name: '', type: null, percentage: null };
      },
      error: (err) => {
        console.error('❌ Error creating KPI:', err);
      },
    });
  }

  confirmDelete(kpi: defaultKpiViewModel) {
  this.selectedItem = kpi;
  this.showDeleteDialog = true;
}

deleteKpi() {
  if (!this.selectedItem) return;

  const body: deleteDefaultKpiViewModel = { id: this.selectedItem.id };

  console.log('Deleting KPI:', body);

  this._KpiService.deleteDefaultKPI(body).subscribe({
    next: (res) => {
      console.log('✅ KPI deleted response:', res);
      this.showDeleteDialog = false;
      this.selectedItem = null;

      // مسح الكاش عشان loadData يعمل request جديد
      delete this.cache[this.pageIndex];

      this.loadData(this.pageIndex);
    },
    error: (err) => {
      console.error('❌ Error deleting KPI:', err);
      this.showDeleteDialog = false;
      this.selectedItem = null;
    }
  });
}

onDialogHide() {
  this.newKpi = {
    name: '',
    type: null,
    percentage: null,
  };
}


}
