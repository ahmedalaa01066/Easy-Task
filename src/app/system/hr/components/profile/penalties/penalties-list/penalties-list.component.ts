import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HrService } from '../../../../services/hr.service';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-penalties-list',
  templateUrl: './penalties-list.component.html',
  styleUrls: ['./penalties-list.component.css'],
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
export class PenaltiesListComponent {
  @Input() candidateId!: string;
  penalties: any[] = [];
  page: CRUDIndexPage = new CRUDIndexPage();
  totalRecords: number = 0;
  pageNumber: number = 1;
  totalPages: number = 0;
  rows: number = 50;
  visibleEdit: boolean = false;
  selectedPenalty: any = {};
  showDeleteDialog: boolean = false;
  penaltyToDelete: any = null;

  constructor(private _hrService: HrService) {}
  ngOnInit(): void {
    this.getPenalties();
  }

  getPenalties() {
    this._hrService
      .getAllPenaltiesInProfile(
        this.candidateId,
        this.page.orderBy,
        this.page.isAscending,
        this.pageNumber,
        this.rows
      )
      .subscribe({
        next: (res: any) => {
          this.penalties = res.data.items;
          this.totalRecords = res.data.records;
          this.totalPages = res.data.pages;
          this.pageNumber = res.data.pageIndex;
          this.rows = res.data.pageSize;
        },
        error: (err) => {
          console.error('Error loading courses', err);
        },
      });
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  goToPrevious() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getPenalties();
    }
  }

  goToNext() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getPenalties();
    }
  }
  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.rows = event.rows;
    this.getPenalties();
  }

  openEditPenalty(penalty: any) {
    this.selectedPenalty = { ...penalty }; // نعمل نسخة علشان ما نعدلش في الـ list على طول
    this.visibleEdit = true;
  }
  onUpdatePenalty() {
    if (!this.selectedPenalty || !this.selectedPenalty.description) return;

    const body = {
      id: this.selectedPenalty.id, // لازم يتبعت مع الـ body
      description: this.selectedPenalty.description,
      // أي properties تانية الـ API محتاجها (مثلاً date, candidateId, ... إلخ)
    };

    this._hrService.editPenalty(body).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.visibleEdit = false;
          this.getPenalties(); // refresh بعد التحديث
        }
      },
      error: (err) => console.error('Error updating penalty', err),
    });
  }

  confirmDelete(penalty: any) {
    this.penaltyToDelete = penalty;
    this.showDeleteDialog = true;
  }
  deletePenalty() {
    if (!this.penaltyToDelete) return;

    const body = { id: this.penaltyToDelete.id };

    this._hrService.removePenalty(body).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.showDeleteDialog = false;
          this.penaltyToDelete = null;
          this.getPenalties();
        }
      },
      error: (err) => {
        console.error('Error deleting penalty', err);
      },
    });
  }
}
