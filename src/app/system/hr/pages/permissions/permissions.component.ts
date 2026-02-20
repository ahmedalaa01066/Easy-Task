import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedService } from 'src/app/core/services/shared.service';
import { HrService } from '../../services/hr.service';
import { CreatePermissionViewModel } from '../../models/interfaces/permissions-vm';
import { PermissionListComponent } from '../../components/permissions/permissions-list/permission-list/permission-list.component';
import { AddPermissionComponent } from '../../components/permissions/add-permission/add-permission/add-permission.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css'],
  standalone: true,
    providers: [HrService, SharedService],
    imports: [
      CommonModule,
      ButtonModule,
      TabMenuModule,
      FormsModule,
      PermissionListComponent,
      AddPermissionComponent
    ],
})
export class PermissionsComponent {
  showAddPermissionModal: boolean = false;
  searchTerm: string = ''; 

  onAddPermission(): void {
      this.showAddPermissionModal = true;
    }
  
    /**
     * Handle candidate creation from modal
     * @param permissionData - The candidate form data
     */
    onPermissionAdded(permissionData: CreatePermissionViewModel): void {
      this.showAddPermissionModal = false;
    }
}
