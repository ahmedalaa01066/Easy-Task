import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
  ],
})
export class PermissionListComponent {
  @Input() searchTerm: string = '';
  page: CRUDIndexPage = new CRUDIndexPage();

  totalRecords: number = 0;
  rows: number = 50;
  pageNumber: number = 1;
  first: number = 0;
constructor(private sanitizer: DomSanitizer) {}
  permissions = [
    {
      candidateName: 'Ahmed Mohamed',
      permissions: 'All Permissions',
      isAllPermissions: true
    },
    {
      candidateName: 'Ahmed Mohamed',
      permissions: 'Send Request, Send Request, +15',
      isAllPermissions: false
    },
    {
      candidateName: 'Ahmed Mohamed',
      permissions: 'Send Request, Send Request, +3',
      isAllPermissions: false
    },
    {
      candidateName: 'Ahmed Mohamed',
      permissions: 'Send Request, Send Request',
      isAllPermissions: false
    },
    {
      candidateName: 'Ahmed Mohamed',
      permissions: 'Send Request, Send Request, +5',
      isAllPermissions: false
    }
  ];



   onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageNumber = Math.ceil((this.first + 1) / this.rows);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }


  editPermission(item: any) {
    console.log('Edit', item);
  }

  deletePermission(item: any) {
    console.log('Delete', item);
  }

formatPermissions(text: string): string {
  return text.replace(/(\+\d+)/g, `<span class="highlight">$1</span>`);
}


}
