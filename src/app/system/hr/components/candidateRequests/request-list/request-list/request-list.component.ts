import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LottieModule } from 'ngx-lottie';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { candidateRequestType } from 'src/app/system/hr/models/enum/candidate-request';
import { SearchCandidateRequestViewModel } from 'src/app/system/hr/models/interfaces/candidate-request-vm';
import { CandidateRequestService } from 'src/app/system/hr/services/candidateRequest/candidate-request.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
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
    LottieModule,
    DropdownModule
  ],
})
export class RequestListComponent {
  @Input() activeTab: number = candidateRequestType.Annual_Request;
  constructor(
    private router: Router,
    private _CandidateRequestService: CandidateRequestService
  ) { }
  candidateRequestType = candidateRequestType
  @Output() countChanged = new EventEmitter<{ tabType: number, count: number }>();
  @Output() showEdit = new EventEmitter<{ type: string, id: string }>();
  @Output() showDetailsEvent = new EventEmitter<{ type: string, id: string }>();

  page: CRUDIndexPage = new CRUDIndexPage();
  //  searchViewModel: SearchCandidateRequestViewModel = new SearchCandidateRequestViewModel();
  totalRecords: number = 0;
  rows: number = 50;
  pageNumber: number = 1;
  first: number = 0;
  currentItem: any;
  statuses = [
    { label: 'Pending', value: 1 },
    { label: 'FirstApproval', value: 2 },
    { label: 'SecondApproval', value: 3 },
    { label: 'Rejected', value: 4 }
  ];

  selectedStatus: number | null = null;
  statusList = ['Pending', 'FirstApproval', 'SecondApproval', 'Rejected'];
  items: any[] = [];
  ngOnInit() {
    this.loadRequests();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['activeTab'].currentValue !== changes['activeTab'].previousValue
    ) {
      this.loadRequests();
    }
  }
  loadRequests() {
    this.pageNumber = 1;

    if (this.activeTab === this.candidateRequestType.Permission_Request) {
      this._CandidateRequestService
        .getPermissionRequests(
          { Status: this.selectedStatus },
          'date',
          true,
          this.pageNumber,
          this.rows
        )
        .subscribe((res: any) => {
          if (res.isSuccess && res.data?.items) {
            this.items = res.data.items.map((x: any) => ({
              id: x.id,
              type: 'permission',
              date: x.date,
              fromTime: x.fromTime,
              toTime: x.toTime,
              candidateName: x.candidateName,
              to: x.to,
              permissionId: x.permissionId,
              permissionName: x.permissionName,
              status: x.permissionRequestStatus
            }));
            this.totalRecords = res.data.records;
            this.countChanged.emit({
              tabType: this.activeTab,
              count: this.totalRecords
            });
          }
        });

    } else {
      const searchModel: any = {
        VacationRequestStatus: this.selectedStatus
      };

      if (this.activeTab === this.candidateRequestType.Work_From_Home_Request) {
        searchModel.IsSpecial = true;
      }

      this._CandidateRequestService
        .getCandidateRequests(
          searchModel,
          'createdDate',
          true,
          this.pageNumber,
          this.rows
        )
        .subscribe((res: any) => {
          if (res.isSuccess) {
            this.items = res.data.items.map((x: any) => ({
              id: x.id,
              vacationName: x.vacationName,
              fromDate: x.fromDate,
              toDate: x.toDate,
              candidateName: x.candidateName,
              createdDate: x.createdDate,
              manager: x.manager,
              vacationRequestType: x.vacationRequestType
            }));
            this.totalRecords = res.data.records;
            this.countChanged.emit({
              tabType: this.activeTab,
              count: this.totalRecords
            });
          }
        });
    }
  }

  getStatusLabel(type: number): string {
    switch (type) {
      case 1: return 'Pending';
      case 2: return 'First Approval';
      case 3: return 'Second Approval';
      case 4: return 'Rejected';
      default: return 'Unknown';
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageNumber = Math.ceil((this.first + 1) / this.rows);
    this.loadRequests();
  }
  setCurrentItem(item: any) {
    this.currentItem = item;
  }
  menuItems = [
    { label: 'Details', command: () => this.showDetails(this.currentItem) },
    { label: 'Edit', command: () => this.editItem(this.currentItem) },
    // { label: 'Delete', command: () => this.deleteItem() }
  ];

  showDetails(item: any) {
    if (this.activeTab === this.candidateRequestType.Permission_Request) {
      this.showDetailsEvent.emit({ type: 'permission', id: item.id });
    } else {
      this.showDetailsEvent.emit({ type: 'vacation', id: item.id });
    }
  }
  editItem(item: any) {
    if (this.activeTab === this.candidateRequestType.Permission_Request) {
      this.showEdit.emit({ type: 'permission', id: item.id });
    } else {
      this.showEdit.emit({ type: 'vacation', id: item.id });
    }
  }


  deleteItem() {
    console.log('Delete clicked');
  }


  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }
  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadRequests();
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadRequests();
    }
  }

}
