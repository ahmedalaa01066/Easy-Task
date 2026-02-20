import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { searchSpecialDayViewModel } from 'src/app/system/hr/models/interfaces/special-days-vm';
import { SpecialDaysService } from 'src/app/system/hr/services/specialDays/special-days.service';

@Component({
  selector: 'app-special-days-list',
  templateUrl: './special-days-list.component.html',
  styleUrls: ['./special-days-list.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    DialogModule
  ],
})
export class SpecialDaysListComponent {
  @Input() searchTerm: string = '';
  @Output() editSpecialDay = new EventEmitter<string>();
  showDeleteDialog: boolean = false;
  deleteId: string | null = null;

  get filteredSpecialDays(): any[] {
    if (!this.searchTerm) return this.specialDays;
    return this.specialDays.filter(day =>
      day.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  specialDays: any[] = [];


  constructor(private specialDaysService: SpecialDaysService) { }

  ngOnInit(): void {
    this.loadSpecialDays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm'] && !changes['searchTerm'].firstChange) {
      this.loadSpecialDays();
    }
  }
  loadSpecialDays() {

    const search: searchSpecialDayViewModel = {
      Name: this.searchTerm || '',
      From: null as any,
      To: null as any,
    };

    this.specialDaysService
      .getSpecialDays(search, 'From', true, 1, 10)
      .subscribe({
        next: (res: any) => {
          this.specialDays = res.data.items;
        },
        error: (err) => {
          console.error('Error fetching special days:', err);
        },
      });
  }

  onEdit(id: string) {
    this.editSpecialDay.emit(id);
  }

  onDeleteClick(id: string) {
    this.deleteId = id;
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    if (this.deleteId) {
      this.specialDaysService.removeSpecialDay({ id: this.deleteId }).subscribe({
        next: () => {
          this.specialDays = this.specialDays.filter(day => day.id !== this.deleteId);
          this.showDeleteDialog = false;
          this.deleteId = null;
        },
        error: (err) => {
          console.error('Error deleting special day:', err);
          this.showDeleteDialog = false;
        }
      });
    }
  }
}
