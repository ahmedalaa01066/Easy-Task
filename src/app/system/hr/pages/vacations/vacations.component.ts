import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { VacationsListComponent } from '../../components/vacations/vacations-list/vacations-list.component';

@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    FormsModule,
    VacationsListComponent,
  ],
})
export class VacationsComponent {
  searchTerm: string = '';
}
