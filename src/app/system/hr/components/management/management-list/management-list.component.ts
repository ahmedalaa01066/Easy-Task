import { ManagementService } from './../../../services/management/management.service';
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
import { HrService } from '../../../services/hr.service';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import {
  EditManagementViewModel,
  ManagementViewModel,
  SearchManagementViewModel,
  selectManagersList,
} from '../../../models/interfaces/management-view-models';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-management-list',
  templateUrl: './management-list.component.html',
  styleUrls: ['./management-list.component.css'],
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
  ],
})
export class ManagementListComponent implements OnInit, OnChanges {
  @Input() searchTerm: string = '';
  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: SearchManagementViewModel = new SearchManagementViewModel();
  managementList: ManagementViewModel[];
  totalRecords: number = 0;
  rows: number = 50;
  editManagementNameIndex: number | null = null;
  editedName: string = '';
  showEditPopup: boolean = false;
  selectedManagement: ManagementViewModel | null = null;
  editedManagerId: string = '';
  pageNumber: number = 1;
  editedManagementName: string = '';
  first: number = 0;
  managers: selectManagersList [] =[];
  selectedManagerOption: any = null;

  constructor(private _hrService: HrService , private _managementService:ManagementService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      this.searchViewModel.name = this.searchTerm;
      this.loadManagements();
    }
  }
  onManagerChange(event: any) {
    this.editedManagerId = event.value;
  }
  ngOnInit(): void {
    this.loadManagements();
    this.loadManagers();
  }
  loadManagements() {
    this._managementService
      .getManagements(
        this.searchViewModel,
        this.page.orderBy,
        this.page.isAscending,
        this.pageNumber,
        this.rows
      )
      .subscribe({
        next: (response: any) => {
          this.managementList = response.data.items || [];

          this.totalRecords = response.totalCount || this.managementList.length;
        },
        error: (err) => {
          console.error('Error loading managementList:', err);
        },
      });
  }
  loadManagers() {
    this._hrService.getManagers().subscribe({
      next: (response: any) => {
        this.managers = response.data.map((manager: any) => ({
          name: manager.name, // أو manager.fullName حسب الـ API
          id: manager.id, // ده اللي هيتبعت كـ managerId
        }));
      },
      error: (err) => {
        console.error('Error loading managers:', err);
      },
    });
  }

  startManagementNameEdit(index: number) {
  this.selectedManagement = this.managementList[index];
  this.editedManagementName = this.selectedManagement.name;
  this.editedManagerId = this.selectedManagement.managerId ?? '';
  this.showEditPopup = true;
}


  saveManagementNameEdit() {
    if (this.editManagementNameIndex !== null) {
      const originalItem = this.managementList[this.editManagementNameIndex];
      const body: EditManagementViewModel = {
        id: originalItem.id,
        name: this.editedName, 
        managerId: this.editedManagerId,
      };
      this._managementService.editManagement(body).subscribe({
        next: () => {
          originalItem.name = this.editedName;
          this.selectedManagement.managerId = this.editedManagerId;

          this.editManagementNameIndex = null;
        },
        error: (err) => {
          console.error('Error updating management:', err);
        },
      });
    }
  }
 savePopupEdit() {
  if (!this.selectedManagement) return;

  const body: EditManagementViewModel = {
    id: this.selectedManagement.id,
    name: this.editedManagementName,
    managerId: this.editedManagerId, // ✅ تبعت ID فقط
  };

  this._managementService.editManagement(body).subscribe({
    next: () => {
      this.selectedManagement.name = this.editedManagementName;
      this.selectedManagement.managerId = this.editedManagerId;
      this.showEditPopup = false;
    },
    error: (err) => {
      console.error('Error updating management:', err);
    },
  });
}

}
