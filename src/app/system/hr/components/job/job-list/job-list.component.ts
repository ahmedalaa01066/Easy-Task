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
import {
  createNewPositionVM,
  JobVM,
  searchJobVM,
} from '../../../models/interfaces/job-vm';
import { AddNewPositionComponent } from '../add-new-position/add-new-position.component';
import { JobService } from '../../../services/job/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
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
    AddNewPositionComponent,
  ],
})
export class JobListComponent {
  @Input() searchTerm: string = '';
  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: searchJobVM = new searchJobVM();
  rows: number = 50;
  pageIndex: number = 1;
  totalPages: number = 0;
  totalRecords: number = 0;
  first: number = 0;
  jobs: JobVM[] = [];
  showDeleteDialog: boolean = false;
  selectedItem: JobVM | null = null;
  showAddPositionModal: boolean = false;
  editingJob: any = null;

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadJobs();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      this.searchViewModel.SearchText = this.searchTerm;
      this.loadJobs();
    }
  }
 loadJobs() {
  this.searchViewModel.SearchText = this.searchTerm || '';

  console.log('Searching for:', this.searchViewModel.SearchText);

  this.jobService
    .getAllJobs(this.searchViewModel, 'name', true, this.pageIndex, this.rows)
    .subscribe({
      next: (res: any) => {
        // البيانات جاية جوه res.data.items
        this.jobs = res.data?.items || [];

        // عدد السجلات من res.data.records
        this.totalRecords = res.data?.records || 0;

        // عدد الصفحات من res.data.pages
        this.totalPages = res.data?.pages || 1;

        // للتأكد في الكونسول
        console.log('Jobs loaded:', this.jobs.length);
        console.log('Total records:', this.totalRecords);
        console.log('Total pages:', this.totalPages);
      },
      error: (err) => {
        console.error('Error loading jobs:', err);
      },
    });
}


  Previous() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.loadJobs();
    }
  }

  Next() {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.loadJobs();
    }
  }
  showDeleteConfirmation(item: JobVM) {
    this.selectedItem = item;
    this.showDeleteDialog = true;
  }
  deleteJob() {
    if (!this.selectedItem) return;

    this.jobService.removeJob(this.selectedItem).subscribe((res) => {
      if (res.isSuccess) {
        this.jobs = this.jobs.filter(
          (course) => course.id !== this.selectedItem?.id
        );
        this.loadJobs();
      }
      this.showDeleteDialog = false;
      this.selectedItem = null;
    });
  }

  editPosition(job: any) {
    this.editingJob = job; // مرر الـ job للـ form
    this.showAddPositionModal = true;
  }

  //add New Position

  /**
   * Handle add Position action
   */
  onAddPosition() {
    this.editingJob = null; // reset علشان يبقى create
    this.showAddPositionModal = true;
  }

  /**
   * Handle Position creation from modal
   * @param positionData - The Position form data
   */
 onPositionAdded() {
  this.showAddPositionModal = false;
  this.editingJob = null;
  this.loadJobs(); // refresh from API
}

}
