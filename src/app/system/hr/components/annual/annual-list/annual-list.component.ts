import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import {
  AnnualViewModel,
  deleteRequestTypeViewModel,
  searchRequestTypeViewModel,
} from '../../../models/interfaces/annual';
import { AnnualService } from '../../../services/annuals/annual.service';

@Component({
  selector: 'app-annual-list',
  templateUrl: './annual-list.component.html',
  styleUrls: ['./annual-list.component.css'],
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
export class AnnualListComponent {
  @Input() searchTerm: string = '';
  @Output() editRequest = new EventEmitter<AnnualViewModel>();

  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: searchRequestTypeViewModel =
    new searchRequestTypeViewModel();
  rows: number = 50;
  pageIndex: number = 1;
  totalPages: number = 0;
  first: number = 0;
  pagedAnnuals: AnnualViewModel[] = [];
  showDeleteDialog: boolean = false;
  selectedItem: AnnualViewModel | null = null;
  annuals: AnnualViewModel[] = []; // هنخليها فاضية في البداية
  deleteInProgress: boolean = false;

  constructor(private annualService: AnnualService) {}

  // ngOnInit() {
  //   this.totalPages = Math.ceil(this.annuals.length / this.rows);
  //   this.updatePagedData();
  // }

  ngOnInit() {
    this.loadAnnuals();
  }

  loadAnnuals() {
    this.annualService
      .getAnnuals(this.searchViewModel, 'name', true, this.pageIndex, this.rows)
      .subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            this.annuals = res.data.items; // حسب الـ API structure
            this.totalPages = Math.ceil(this.annuals.length / this.rows);
            this.updatePagedData();
          }
        },
        error: (err) => {
          console.error('Error loading annuals:', err);
        },
      });
  }

  updatePagedData() {
    const start = (this.pageIndex - 1) * this.rows;
    const end = start + this.rows;
    this.pagedAnnuals = this.annuals.slice(start, end);
  }

  Previous() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.updatePagedData();
    }
  }

  Next() {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.updatePagedData();
    }
  }
  showDeleteConfirmation(item: AnnualViewModel) {
    this.selectedItem = item;
    this.showDeleteDialog = true;
  }
  deleteRequestType() {
    if (!this.selectedItem) return;
    const body: deleteRequestTypeViewModel = {
      id: this.selectedItem.id,
    };

    this.deleteInProgress = true;

    this.annualService.deleteRequestType(body).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Remove from list
          this.annuals = this.annuals.filter(
            (a) => a.id !== this.selectedItem?.id
          );
          this.updatePagedData();
        }
        this.closeDeleteDialog();
      },
      error: (err) => {
        console.error('Error deleting:', err);
        this.closeDeleteDialog();
      },
    });
  }
  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.selectedItem = null;
    this.deleteInProgress = false;
  }
  ngOnChanges() {
    this.searchViewModel.Name = this.searchTerm;
    this.loadAnnuals();
  }

  editRequestType(annual: AnnualViewModel) {
  this.editRequest.emit(annual);
}
}
