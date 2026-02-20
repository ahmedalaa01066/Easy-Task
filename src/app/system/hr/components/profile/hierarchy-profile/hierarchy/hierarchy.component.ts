import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { HrService } from '../../../../services/hr.service';
import { GetManagerByCandidateViewModel } from '../../../../models/interfaces/profile-details-view-model';

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css'],
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
export class HierarchyComponent {
  @Input() candidateId!: string;
manager: GetManagerByCandidateViewModel[] = [];
  page: CRUDIndexPage = new CRUDIndexPage();
  
 constructor(private _hrService: HrService) {}
  ngOnInit(): void {
    this.getManager();
  }

getManager() {
  this._hrService.GetManagerByCandidate(this.candidateId)
    .subscribe({
      next: (res: any) => {
        if (res.data) {
          this.manager = [res.data]; // حوّل object لـ array
        } else {
          this.manager = [];
        }

        console.log('Manager array:', this.manager);
      },
      error: (err) => {
        console.error('Error loading managers', err);
      },
    });
}





   trackByIndex(index: number, item: any): number {
    return index;
  }
}
