import { CreateHierarchyViewModel } from './../../../models/interfaces/hierarchy-view-model';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { FormsModule } from '@angular/forms';
import { HierarchyTabType } from '../../../models/enum/hierarchy-tab';
import {
  SearchHierarcyiewModel,
  HierarchyViewModel,
} from '../../../models/interfaces/hierarchy-view-model';
import { HrService } from '../../../services/hr.service';
import { ApiStatus } from 'src/app/core/models/enums/apiStatus';
import { AnimationOptions, LottieModule } from 'ngx-lottie';
import { DialogModule } from 'primeng/dialog';
import { sequence } from '@angular/animations';
import { Router } from '@angular/router';
import { HierarchyService } from '../../../services/hierarchy/hierarchy.service';

@Component({
  selector: 'app-hierarchy-list',
  templateUrl: './hierarchy-list.component.html',
  styleUrls: ['./hierarchy-list.component.css'],
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
    DialogModule,
  ],
})
export class HierarchyListComponent implements OnChanges {
  @Input() activeTab: number = HierarchyTabType.LEVEL_1TO_3;
  colorMap: { [owner: string]: string } = {};
  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: SearchHierarcyiewModel = { num: 1 };
  sections: HierarchyViewModel[] = [];
  totalRecords: number = 0;
  rows: number = 50;
  editedName: string = '';
  pageNumber: number = 1;
  first: number = 0;
  showEditPopup: boolean = false;
  selectedHierarchy: any = null;
  editHierarchyNameIndex: number | null = null;
  editedHierarchyLevelName: string = '';
  apiStatus: ApiStatus = ApiStatus.Loading;
  options: AnimationOptions = {
    path: 'assets/loading.json',
  };
  ApiStatus = ApiStatus;

  constructor(private router: Router, private _hierarchyService:HierarchyService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['activeTab'].currentValue !== changes['activeTab'].previousValue
    ) {
      this.loadHierarchyLevels();
    }
  }
  ngOnInit() {
    this.sections.forEach((section, index) => {
      const colors = ['purple', 'green', 'blue'];
      const colorKey = colors[index % colors.length];
      this.colorMap[section.candidateName] = colorKey;
    });
    this.loadHierarchyLevels();
  }

  getBackgroundClass(owner: string): string {
    const colorKey = this.colorMap[owner];
    switch (colorKey) {
      case 'purple':
        return 'bg-color-purple';
      case 'green':
        return 'bg-color-green';
      case 'blue':
        return 'bg-color-blue';
      default:
        return 'bg-color-blue';
    }
  }

  getCardBorderClass(owner: string): string {
    const colorKey = this.colorMap[owner];
    switch (colorKey) {
      case 'purple':
        return 'border-purple';
      case 'green':
        return 'border-green';
      case 'blue':
        return 'border-blue';
      default:
        return 'border-blue';
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageNumber = Math.ceil((this.first + 1) / this.rows);
    this.loadHierarchyLevels();
  }

  loadHierarchyLevels() {
    this.apiStatus = ApiStatus.Loading;
    this.searchViewModel.num = this.activeTab;

    this._hierarchyService
      .getAllHierarchyLevels(
        this.searchViewModel,
        this.page.orderBy,
        this.page.isAscending,
        this.pageNumber,
        this.rows
      )
      .subscribe({
        next: (response: any) => {
          this.sections = response.data || [];
          this.totalRecords = response.data.totalCount || this.sections.length;
          const colors = ['purple', 'green', 'blue'];
          this.sections.forEach((section, index) => {
            const colorKey = colors[index % colors.length];
            this.colorMap[section.managementName] = colorKey;
          });
          this.apiStatus = ApiStatus.Loaded;
        },
        error: (err) => {
          console.error('Error fetching hierarchy levels:', err);
          this.apiStatus = ApiStatus.Error;
        },
      });
  }

  startHierarchyNameEdit(candidateIndex: number, candidate: any) {
    this.editHierarchyNameIndex = candidateIndex;
    this.selectedHierarchy = candidate;
    // 👇 نحط اسم الـ Level جوه الـ input بدل اسم الـ candidate
    this.editedHierarchyLevelName = candidate.levelName;
  }

  cancelHierarchyNameEdit() {
    this.editHierarchyNameIndex = null;
    this.editedHierarchyLevelName = '';
    this.selectedHierarchy = null;
  }

  saveHierarchyNameEdit() {
    if (!this.selectedHierarchy) return;

    const body: CreateHierarchyViewModel = {
      id: this.selectedHierarchy.levelId, // نعدل على الليفل
      name: this.editedHierarchyLevelName, // الاسم الجديد هو levelName
      sequence: this.selectedHierarchy.levelSeq ?? 0,
    };

    this._hierarchyService.editHierarchy(body).subscribe({
      next: () => {
        // نحدث القيمة جوه الواجهة
        this.selectedHierarchy.levelName = this.editedHierarchyLevelName;
        this.cancelHierarchyNameEdit();
      },
      error: (err) => {
        console.error('❌ Error updating hierarchy:', err);
      },
    });
  }
  goToProfile(id: number) {
  this.router.navigate(['/hr/profile', id]);
}
}
