import { CandidateService } from './../../services/candidate/candidate.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { CandidatesListComponent } from '../../components/candidates/candidates-list/candidates-list.component';
import {
  CreateCandidateViewModel,
  SearchCandidateViewModel,
} from '../../models/interfaces/candidate-view-models';
import { HrService } from '../../services/hr.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { CandidateTabType } from '../../models/enum/candidate-tab';
import { AddCandidateComponent } from '../../components/candidates/add-candidate/add-candidate.component';


@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css'],
  standalone: true,
  providers: [HrService, SharedService],
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    CandidatesListComponent,
    AddCandidateComponent,
  ],
})
export class CandidatesComponent {
  // Expose enum to template
  CandidateTabType = CandidateTabType;
  showDownloadOptions = false;
  searchViewModel: SearchCandidateViewModel = new SearchCandidateViewModel();

  // Current active tab
  activeTab: CandidateTabType = CandidateTabType.ALL_CANDIDATES;

  // Modal visibility
  showAddCandidateModal: boolean = false;

  // Tab menu items for PrimeNG TabMenu
  tabItems: MenuItem[] = [
    {
      label: 'All Candidates',
      id: CandidateTabType.ALL_CANDIDATES.toString(),
      command: () => this.onTabChange(CandidateTabType.ALL_CANDIDATES),
    },
    {
      label: 'Current',
      id: CandidateTabType.CURRENT.toString(),
      command: () => this.onTabChange(CandidateTabType.CURRENT),
    },
    {
      label: 'Ended',
      id: CandidateTabType.ENDED.toString(),
      command: () => this.onTabChange(CandidateTabType.ENDED),
    },
  ];

  /**
   * Handle tab change
   * @param tabType - The selected tab type
   */
  constructor(private _candidateService:CandidateService, private readonly _hrService: HrService, private readonly _sharedService: SharedService) {}

  onTabChange(tabType: CandidateTabType): void {
    this.activeTab = tabType;
    // Add your tab change logic here
  }

  /**
   * Handle export action
   */
  onExport() {
    this.showDownloadOptions = false;
    this._candidateService.getCandidateExcel(this.searchViewModel).subscribe({
      next: (response: Blob) => {
        const fileName = 'Candidate';
        this._sharedService.downloadFile(response, fileName);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  /**
   * Handle add candidate action
   */
  onAddCandidate(): void {
    this.showAddCandidateModal = true;
  }

  /**
   * Handle candidate creation from modal
   * @param candidateData - The candidate form data
   */
  onCandidateAdded(candidateData: CreateCandidateViewModel): void {
    this.showAddCandidateModal = false;
  }
}
