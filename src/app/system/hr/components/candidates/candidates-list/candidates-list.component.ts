import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {
  CandidateViewModel,
  SearchCandidateViewModel,
} from '../../../models/interfaces/candidate-view-models';
import { HrService } from '../../../services/hr.service';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { HttpClient } from '@angular/common/http';
import { CandidateStatus } from '../../../models/enum/candidate-status';
import { CandidateTabType } from '../../../models/enum/candidate-tab';
import { Router } from '@angular/router';
import { CandidateService } from '../../../services/candidate/candidate.service';

@Component({
  selector: 'app-candidates-list',
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    FormsModule,
  ],
})
export class CandidatesListComponent implements OnChanges {
  @Input() activeTab: number = CandidateTabType.ALL_CANDIDATES;
  constructor(
    private router: Router,
    private _candidateService: CandidateService
  ) {}

  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: SearchCandidateViewModel = new SearchCandidateViewModel();

  candidates: CandidateViewModel[] = [];
  totalRecords: number = 0;
  rows: number = 50;
  pageNumber: number = 1;
  first: number = 0;
  
  // Filter properties
  globalFilterValue: string = '';
  statusOptions: any[] = [
    { label: 'Active', value: CandidateStatus.ACTIVE },
    { label: 'Resigned', value: CandidateStatus.RESIGNED }
  ];

  // Menu items for actions
  menuItems: MenuItem[] = [
    {
      label: 'View Profile',
      icon: 'pi pi-user',
      command: () => this.viewProfile(),
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.editCandidate(),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.deleteCandidate(),
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['activeTab'].currentValue !== changes['activeTab'].previousValue
    ) {
      this.loadCandidates();
    }
  }

  loadCandidates() {
    switch (this.activeTab) {
      case CandidateTabType.ALL_CANDIDATES:
        delete this.searchViewModel.candidateStatus;
        break;

      case CandidateTabType.CURRENT:
        this.searchViewModel.candidateStatus = CandidateStatus.ACTIVE;
        break;

      case CandidateTabType.ENDED:
        this.searchViewModel.candidateStatus = CandidateStatus.RESIGNED;
        break;
    }

    this._candidateService
      .getCandidates(
        this.searchViewModel,
        this.page.orderBy,
        this.page.isAscending,
        this.pageNumber,
        this.rows
      )
      .subscribe({
        next: (response: any) => {
          this.candidates = response.data.items || [];

          this.candidates.forEach((c) => {
            c.statusName =
              c.candidateStatus === CandidateStatus.ACTIVE
                ? 'Active'
                : 'Resigned';
          });

          this.totalRecords = response.totalCount || this.candidates.length;
        },
        error: (err) => {
          console.error('Error loading candidates:', err);
        },
      });
  }

  /**
   * Get status severity for PrimeNG tag
   */
  getStatusSeverity(
    status: number
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' {
    switch (status) {
      case CandidateStatus.ACTIVE:
        return 'success';
      case CandidateStatus.RESIGNED:
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  goToProfile(id: number) {
    this.router.navigate(['/hr/profile', id]);
  }
  /**
   * Handle pagination
   */
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageNumber = Math.ceil((this.first + 1) / this.rows);
    this.loadCandidates();
  }

  /**
   * Clear global filter
   */
  clear(table: any) {
    table.clear();
    this.globalFilterValue = '';
  }

  /**
   * Apply global filter
   */
  onGlobalFilter(table: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  /**
   * View candidate profile
   */
  viewProfile() {
    console.log('View profile');
  }

  /**
   * Edit candidate
   */
  editCandidate() {
    console.log('Edit candidate');
  }

  /**
   * Delete candidate
   */
  deleteCandidate() {
    console.log('Delete candidate');
  }

  /**
   * Get avatar color based on initials
   */
  getAvatarColor(firstName: string, lastName: string): string {
    const colors = ['#F9F5FF'];
    let initials = firstName + lastName;
    // Generate consistent color based on initials
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
