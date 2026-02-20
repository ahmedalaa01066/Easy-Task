import { Component, ViewChild } from '@angular/core';
import { createRequestTypeViewModel } from '../../models/interfaces/annual';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormsModule } from '@angular/forms';
import { AnnualListComponent } from '../../components/annual/annual-list/annual-list.component';
import { AddRequestComponent } from '../../components/annual/add-request/add-request.component';

@Component({
  selector: 'app-annual',
  templateUrl: './annual.component.html',
  styleUrls: ['./annual.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    FormsModule,
    AnnualListComponent,
    AddRequestComponent,
  ],
})
export class AnnualComponent {
  showAddRequestModal: boolean = false;
  searchTerm: string = '';
  selectedRequest: createRequestTypeViewModel | null = null;

  @ViewChild(AnnualListComponent) annualList!: AnnualListComponent;

  constructor() {}
  /**
   * Handle add Request Type action
   */
 onAddRequest(): void {
  this.selectedRequest = null;   // 👈 تصفير البيانات عشان المودال يفتح فاضي
  this.showAddRequestModal = true;
}


  /**
   * Handle Request Type creation from modal
   * @param requestData - The Request Type form data
   */
  onRequestAdded(requestData: createRequestTypeViewModel): void {
    this.showAddRequestModal = false;

    // بعد ما يتقفل المودال نعمل reload للـ list
    if (this.annualList) {
      this.annualList.loadAnnuals();
    }
  }

onEditRequest(request: createRequestTypeViewModel): void {
  this.selectedRequest = request;
  this.showAddRequestModal = true;
}
}
