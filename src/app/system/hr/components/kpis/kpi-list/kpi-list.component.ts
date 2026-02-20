import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { createKpiViewModel, KpiViewModel, searchKpiViewModel } from '../../../models/interfaces/kpi-view-model';
import { KpiService } from '../../../services/kpi/kpi.service';
import { KpiType } from '../../../models/enum/kpi-type'; // غيّري الباث حسب مكان الملف
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-kpi-list',
  templateUrl: './kpi-list.component.html',
  styleUrls: ['./kpi-list.component.css'],
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
export class KpiListComponent implements OnInit {
  @Input() searchTerm: string = '';

  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: searchKpiViewModel = new searchKpiViewModel();
  kpisList: KpiViewModel[] = [];
  totalRecords: number = 0;
  rows: number = 50;
  loading: boolean = false;
// popup
  displayDialog: boolean = false;
  selectedCandidateId: string | null = null;
  environment = environment;

  // form model
  newKpi: createKpiViewModel = {
    name: '',
    type: 1,
    candidateId: '',
    percentage: 0,
  };
  typeOptions = [
    { label: 'Course', value: KpiType.Course },
    { label: 'Attendance', value: KpiType.Attendance },
    { label: 'Other', value: KpiType.Other },
  ];
 
  constructor(private _kpiService: KpiService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      this.searchViewModel.SearchText = this.searchTerm;
      this.loadKPIs();
    }
  }
  ngOnInit() {
    this.loadKPIs();
  }

  
  loadKPIs() {
    this.loading = true;
    const searchVM: searchKpiViewModel = { SearchText: this.searchTerm };

    this._kpiService
      .getKPIs(searchVM, 'name', true, 1, 50)
      .subscribe((res: any) => {
        this.kpisList = res?.data?.items ?? [];
        this.loading = false;
      });
  }
// open popup
  onAddKpi(candidateId: string) {
    this.selectedCandidateId = candidateId;
    this.newKpi = {
      name: '',
      type: 1,
      candidateId: candidateId,
      percentage: 0,
    };
    this.displayDialog = true;
  }

  // save
  saveKpi() {
    if (!this.selectedCandidateId) return;

    this.newKpi.candidateId = this.selectedCandidateId;

    this._kpiService.createKPI(this.newKpi).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.displayDialog = false;
          this.loadKPIs();
        }
      },
      error: (err) => {
        console.error('Error saving KPI', err);
      },
    });
  }
  getInitials(fullName: string): string {
  if (!fullName) return '';

  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase(); // لو اسم واحد
  }

  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  return first + last;
}

getFullPath(path: string): string {
    return `${this.environment.api}/${path}`;
  }


  onDialogHide() {
  this.newKpi = {
    name: '',
    type: 1,
    candidateId: '',
    percentage: 0,
  };
  this.selectedCandidateId = null;
}

}
