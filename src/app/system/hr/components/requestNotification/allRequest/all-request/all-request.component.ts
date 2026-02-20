import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LottieModule } from 'ngx-lottie';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { requestNotificationType } from 'src/app/system/hr/models/enum/request-notification';
import {
  searchRequestNotificationVM,
  SearchPermissionRequestViewModel,
} from 'src/app/system/hr/models/interfaces/request-notification-vm';
import { NotificationService } from 'src/app/system/hr/services/notificationRequest/notification.service';

@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.component.html',
  styleUrls: ['./all-request.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    LottieModule,
  ],
})
export class AllRequestComponent {
  @Input() activeTab: number = requestNotificationType.Annual_Request;
  @Input() isSpecial: boolean = false; 
 requestNotificationType = requestNotificationType;
  constructor(private router: Router, private _notificationService: NotificationService) {}

  page: CRUDIndexPage = new CRUDIndexPage();
  totalRecords: number = 0;
  rows: number = 10;
  pageNumber: number = 1;
  first: number = 0;
  loading: boolean = false;

  requests: any[] = [];

  ngOnInit() {
    this.loadRequests();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeTab'] && !changes['activeTab'].firstChange) {
      this.pageNumber = 1;
      this.loadRequests();
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageNumber = Math.ceil((this.first + 1) / this.rows);
    this.loadRequests();
  }

 loadRequests() {
  this.loading = true;

 if (this.activeTab === requestNotificationType.Permission_Request) {
  const searchModel: SearchPermissionRequestViewModel = { Status: null };
  this._notificationService
  .getPermissionRequests(searchModel, 'id', false, this.pageNumber, this.rows)
  .subscribe({
    next: (res) => {
      const data = res.data?.items || res.data.items || [];
      this.requests = data;
      this.totalRecords = res.data?.records || res.data.records || data.length;
      this.loading = false;
    },
    error: () => (this.loading = false),
  });
 }
 else {
    // ✅ Annual Request أو Work From Home Request API
    const isWorkFromHome =
      this.activeTab === requestNotificationType.Work_From_Home_Request;

    const searchModel: searchRequestNotificationVM = {
      VacationRequestStatus: 0,
      IsSpecial: isWorkFromHome, 
    };

    this._notificationService
      .getNotificationRequests(searchModel, 'id', false, this.pageNumber, this.rows)
      .subscribe({
        next: (res) => {
          const data = res.data?.items || [];
          this.requests = data;
          this.totalRecords = res.data?.records || data.length;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }
}


  getSectionTitle(): string {
    switch (this.activeTab) {
      case requestNotificationType.Work_From_Home_Request:
        return 'Work from home Requests';
      case requestNotificationType.Permission_Request:
        return 'Permission Requests';
      case requestNotificationType.Annual_Request:
      default:
        return 'Annual Requests';
    }
  }

  getIconClass(): string {
    switch (this.activeTab) {
      case requestNotificationType.Work_From_Home_Request:
        return 'pi-home';
      case requestNotificationType.Permission_Request:
        return 'pi-send';
      case requestNotificationType.Annual_Request:
      default:
        return 'pi-bell';
    }
  }
  getTotalPages(): number {
  return Math.ceil(this.totalRecords / this.rows);
}

}
