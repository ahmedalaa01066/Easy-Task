import {
  searchVacationsVM,
  VacationsVM,
} from './../../../models/interfaces/vacations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { VacationsService } from '../../../services/vacations/vacations.service';

@Component({
  selector: 'app-vacations-list',
  templateUrl: './vacations-list.component.html',
  styleUrls: ['./vacations-list.component.css'],
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
export class VacationsListComponent {
  @Input() searchTerm: string = '';
  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: searchVacationsVM = new searchVacationsVM();
  rows: number = 50;
  pageIndex: number = 1;
  totalPages: number = 0;
  totalRecords: number = 0;
  first: number = 0;
  vacations: VacationsVM[] = [];
  showDeleteDialog: boolean = false;
  selectedItem: VacationsVM | null = null;
  showAddPositionModal: boolean = false;
  editingVacation: any = null;

  constructor(private _vacationsService: VacationsService) {}

  ngOnInit() {
    this.loadVacations();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      this.searchViewModel.SearchText = this.searchTerm;
      this.loadVacations();
    }
  }
  loadVacations() {
    this.searchViewModel.SearchText = this.searchTerm || '';

    console.log('Searching for:', this.searchViewModel.SearchText);

    this._vacationsService
      .getAllVacations(
        this.searchViewModel,
        'name',
        true,
        this.pageIndex,
        this.rows,
      )
      .subscribe({
        next: (res: any) => {
          // البيانات جاية جوه res.data.items
          this.vacations = res.data?.items || [];

          // عدد السجلات من res.data.records
          this.totalRecords = res.data?.records || 0;

          // عدد الصفحات من res.data.pages
          this.totalPages = res.data?.pages || 1;

          // للتأكد في الكونسول
          console.log('Vacations loaded:', this.vacations.length);
          console.log('Total records:', this.totalRecords);
          console.log('Total pages:', this.totalPages);
        },
        error: (err) => {
          console.error('Error loading vacations:', err);
        },
      });
  }
 

  Previous() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.loadVacations();
    }
  }

  Next() {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.loadVacations();
    }
  }

  editVacation(vacation: any) {
    this.editingVacation = vacation; // مرر الـ vacation للـ form
    this.showAddPositionModal = true;
  }
}
