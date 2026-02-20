import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedService } from 'src/app/core/services/shared.service';
import { AddCandidateComponent } from '../../components/candidates/add-candidate/add-candidate.component';
import { CandidatesListComponent } from '../../components/candidates/candidates-list/candidates-list.component';
import { HrService } from '../../services/hr.service';
import { CandidateService } from '../../services/candidate/candidate.service';
import { SearchCandidateViewModel } from '../../models/interfaces/candidate-view-models';
import { DocumentListComponent } from '../../components/Documents/document-list/document-list.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
    standalone: true,
    providers: [HrService, SharedService],
    imports: [
      CommonModule,
      ButtonModule,
      TabMenuModule,
      DocumentListComponent,
      AddCandidateComponent,
    ],
})
export class DocumentsComponent {

  showDownloadOptions = false;
  
  constructor( private readonly _hrService: HrService, private readonly _sharedService: SharedService) {}


  //  onExport() {
  //   this.showDownloadOptions = false;
  //   this._candidateService.getCandidateExcel(this.searchViewModel).subscribe({
  //     next: (response: Blob) => {
  //       const fileName = 'Candidate';
  //       this._sharedService.downloadFile(response, fileName);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     },
  //   });
  // }
}
