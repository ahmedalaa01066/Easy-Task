import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormsModule } from '@angular/forms';
import { HierarchyTabType } from '../../models/enum/hierarchy-tab';
import { MenuItem } from 'primeng/api';
import { AddHierarchyComponent } from '../../components/hierarchy/add-hierarchy/add-hierarchy.component';
import { HierarchyListComponent } from '../../components/hierarchy/hierarchy-list/hierarchy-list.component';
import { CreateHierarchyViewModel } from '../../models/interfaces/hierarchy-view-model';
import { HrService } from '../../services/hr.service';
import { HierarchyService } from '../../services/hierarchy/hierarchy.service';

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    FormsModule,
    AddHierarchyComponent,
    HierarchyListComponent,
  ],
})
export class HierarchyComponent {
  showAddHierarchyModal: boolean = false;
  // Current active tab
  activeTab: number = 1;
  sections: any[] = [];
  constructor(private readonly _hrService: HrService ,private _hierarchyService:HierarchyService) {
    this.getAllLevel();
  }
  // Tab menu items for PrimeNG TabMenu
  tabItems: MenuItem[] = [];
  getAllLevel(): void {
    this._hierarchyService.getAllLevels().subscribe((res) => {
      this.sections = res.data.items;
      this.sections.sort((a, b) => a.sequence - b.sequence);
      const maxSequence = this.sections.reduce(
        (max, section) => Math.max(max, section.sequence),
        0
      );
      console.log(maxSequence);
      
      
      this.tabItems = this.sections.map((section: any) => ({
        label:
          section.sequence + 3 <= maxSequence
            ? `Level ${section.sequence} to ${section.sequence + 3}`
            : ``,
        id: section.id,
        command: () => this.onTabChange(section.sequence),
      }));
    });
  }
  onTabChange(tabType: number): void {
    this.activeTab = tabType;
    // Add your tab change logic here
  }

  onAddHierarchy(): void {
    this.showAddHierarchyModal = true;
  }

  onHierarchyAdded(HierarchyData: CreateHierarchyViewModel): void {
    this.showAddHierarchyModal = false;
  }
}
