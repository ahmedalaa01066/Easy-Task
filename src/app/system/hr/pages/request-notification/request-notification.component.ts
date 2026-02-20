import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedService } from 'src/app/core/services/shared.service';
import { HrService } from '../../services/hr.service';
import { requestNotificationType } from '../../models/enum/request-notification';
import { MenuItem } from 'primeng/api';
import { AllRequestComponent } from '../../components/requestNotification/allRequest/all-request/all-request.component';

@Component({
  selector: 'app-request-notification',
  templateUrl: './request-notification.component.html',
  styleUrls: ['./request-notification.component.css'],
  standalone: true,
  providers: [HrService, SharedService],
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    AllRequestComponent
  ],
})
export class RequestNotificationComponent {
  requestNotificationType = requestNotificationType;
  showDownloadOptions = false;

  // المتغير الجديد اللي هنبعته للـ AllRequestComponent
  isSpecial: boolean = false;

  activeTab: requestNotificationType = requestNotificationType.Annual_Request;

  tabItems: MenuItem[] = [
    {
      label: 'Annual Request',
      id: requestNotificationType.Annual_Request.toString(),
      command: () => this.onTabChange(requestNotificationType.Annual_Request),
    },
    {
      label: 'Work From Home Request',
      id: requestNotificationType.Work_From_Home_Request.toString(),
      command: () => this.onTabChange(requestNotificationType.Work_From_Home_Request),
    },
    {
      label: 'Permission Request',
      id: requestNotificationType.Permission_Request.toString(),
      command: () => this.onTabChange(requestNotificationType.Permission_Request),
    },
  ];

  activeItem: MenuItem = this.tabItems[0];

  constructor(
    private readonly _hrService: HrService,
    private readonly _sharedService: SharedService
  ) {}

  /**
   * Handle tab change
   * @param tabType - The selected tab type
   */
  onTabChange(tabType: requestNotificationType): void {
    this.activeTab = tabType;
    this.activeItem = this.tabItems.find(t => t.id === tabType.toString())!;

    // ✅ تحديد قيمة isSpecial حسب نوع التبويب
    this.isSpecial = tabType === requestNotificationType.Work_From_Home_Request;
  }
}
