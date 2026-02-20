import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { ManagementListComponent } from '../../components/management/management-list/management-list.component';
import { AddManagementComponent } from '../../components/management/add-management/add-management.component';
import { CreateManagementViewModel } from '../../models/interfaces/management-view-models';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
  standalone: true,
  imports: [CommonModule, ButtonModule, TabMenuModule, AddManagementComponent, FormsModule, ManagementListComponent],
})
export class ManagementComponent {
  showAddManagementModal: boolean = false;
  searchTerm: string = ''; 

  constructor() {}

  /**
   * Handle add Management action
   */
  onAddManagement(): void {
    this.showAddManagementModal = true;
  }

  /**
   * Handle management creation from modal
   * @param managementData - The management form data
   */
  onManagementAdded(managementData: CreateManagementViewModel): void {
    // Here you would typically call a service to save the management
    // For now, we'll just close the modal
    this.showAddManagementModal = false;
  }

  
}
