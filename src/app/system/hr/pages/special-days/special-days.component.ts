import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedService } from 'src/app/core/services/shared.service';
import { HrService } from '../../services/hr.service';
import { CreateSpecialDayViewModel } from '../../models/interfaces/special-days-vm';
import { AddSpecialDayComponent } from '../../components/SpecialDays/add-special-days/add-special-day/add-special-day.component';
import { SpecialDaysListComponent } from '../../components/SpecialDays/special-days-list/special-days-list/special-days-list.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-special-days',
  templateUrl: './special-days.component.html',
  styleUrls: ['./special-days.component.css'],
  standalone: true,
  providers: [HrService, SharedService],
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    FormsModule,
    AddSpecialDayComponent,
    SpecialDaysListComponent
  ],
})
export class SpecialDaysComponent {
  showAddSpecialDayModal: boolean = false;
  searchTerm: string = '';
  editId: string | null = null;

  constructor() { }

  onAddSpecialDay(): void {
    this.showAddSpecialDayModal = true;
  }


  /**
     * Handle management creation from modal
     * @param managementData - The management form data
     */
  onSpecialDaysAdded(specialDay: CreateSpecialDayViewModel): void {
    // Here you would typically call a service to save the management
    // For now, we'll just close the modal
    this.showAddSpecialDayModal = false;
  }


 
  onSpecialDaysUpdated(updatedDay: any) {
    this.showAddSpecialDayModal = false;
    this.editId = null;
  }

  onEditSpecialDay(id: string) {
  console.log('Edit clicked with ID:', id);
  this.editId = id;
  this.showAddSpecialDayModal = true;
}

}
