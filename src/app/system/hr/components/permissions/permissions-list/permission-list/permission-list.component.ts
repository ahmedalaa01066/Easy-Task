import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { PermissionsService } from 'src/app/system/hr/services/Permissions/permissions.service';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    MenuModule,
    TagModule,
    AvatarModule,
  ],
})
export class PermissionListComponent implements OnInit ,OnChanges  {
ngOnChanges(changes: SimpleChanges): void {
  if (changes['searchTerm'] && !changes['searchTerm'].firstChange) {
    this.pageNumber = 1;
    this.first = 0;
    this.loadPermissions();
  }
}
  @Input() searchTerm: string = '';
@Output() editClicked = new EventEmitter<any>();
  page: CRUDIndexPage = new CRUDIndexPage();

  permissions: any[] = [];

  totalRecords: number = 0;
  rows: number = 10;
  pageNumber: number = 1;
  first: number = 0;

  constructor(private permissionsService: PermissionsService) {}

 ngOnInit(): void {
  this.loadPermissions();

  this.permissionsService.getAllPermissions.subscribe(() => {
    this.loadPermissions();
  });
}

  loadPermissions() {
    const searchModel = {
      Name: this.searchTerm || ''
    };

    this.permissionsService
      .getPermissiona(
        searchModel,
        'Name',
        true,
        this.pageNumber,
        this.rows
      )
      .subscribe((res: any) => {

        this.permissions = res.data?.items || [];
        this.totalRecords = res.data?.totalCount || 0;

      });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageNumber = event.page + 1;

    this.loadPermissions();
  }

 editPermission(item: any) {
  this.editClicked.emit(item);
}

  deletePermission(item: any) {
    console.log('Delete', item);
  }
}