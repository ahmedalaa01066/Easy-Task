import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedService } from 'src/app/core/services/shared.service';
import { HrService } from '../../services/hr.service';
import { candidateRequestType } from '../../models/enum/candidate-request';
import { MenuItem } from 'primeng/api';
import { RequestListComponent } from '../../components/candidateRequests/request-list/request-list/request-list.component';
import { AddRequestComponent } from '../../components/candidateRequests/add-request/add-request/add-request.component';
import { CreateVacationRequestViewModel } from '../../models/interfaces/candidate-request-vm';
import { RequestDetailsComponent } from '../../components/candidateRequests/request-details/request-details/request-details.component';

@Component({
  selector: 'app-candidate-requests',
  templateUrl: './candidate-requests.component.html',
  styleUrls: ['./candidate-requests.component.css'],
  standalone: true,
  providers: [HrService, SharedService],
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    RequestListComponent,
    AddRequestComponent,
    RequestDetailsComponent
  ],
})
export class CandidateRequestsComponent {
  candidateRequestType = candidateRequestType;
  showDownloadOptions = false;
  showDetailsModal: boolean = false;
  detailsData: { type: string, id: string } | null = null;
  activeTab: candidateRequestType = candidateRequestType.Annual_Request;
  showAddCandidateModal: boolean = false;
  editData: { type: string, id: string } | null = null;

  onEditRequest(event: { type: string, id: string }) {
    this.editData = event;
    this.showAddCandidateModal = true;
  }
  onShowDetails(event: { type: string, id: string }) {
    this.detailsData = event;
    this.showDetailsModal = true;
  }
  tabCounts: { [key: number]: number } = {
    [candidateRequestType.Annual_Request]: 0,
    [candidateRequestType.Work_From_Home_Request]: 0,
    [candidateRequestType.Permission_Request]: 0
  };
  onTabCountChanged(tabType: candidateRequestType, count: number) {
    this.tabCounts[tabType] = count;
  }

  tabItems: MenuItem[] = [
    {
      label: 'Annual Requests',
      id: candidateRequestType.Annual_Request.toString(),
      command: () => this.onTabChange(candidateRequestType.Annual_Request),
    },
    {
      label: 'Work From Home Requests',
      id: candidateRequestType.Work_From_Home_Request.toString(),
      command: () => this.onTabChange(candidateRequestType.Work_From_Home_Request),
    },
    {
      label: 'Permission Requests',
      id: candidateRequestType.Permission_Request.toString(),
      command: () => this.onTabChange(candidateRequestType.Permission_Request),
    },
  ];
  activeItem: MenuItem = this.tabItems[0];

  /**
   * Handle tab change
   * @param tabType - The selected tab type
   */
  constructor(private readonly _hrService: HrService, private readonly _sharedService: SharedService) { }

  onTabChange(tabType: candidateRequestType): void {
    this.activeTab = tabType;
    this.activeItem = this.tabItems.find(t => t.id === tabType.toString())!;

  }


  onAddCandidate(): void {
    this.editData = null;
    this.showAddCandidateModal = true;
  }

  /**
   * Handle candidate creation from modal
   * @param candidateData - The candidate form data
   */
  onCandidateAdded(candidateData: CreateVacationRequestViewModel): void {
    this.showAddCandidateModal = false;
  }

}
