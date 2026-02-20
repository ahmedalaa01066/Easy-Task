import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HrService } from '../../../../services/hr.service';

@Component({
  selector: 'app-download-course',
  templateUrl: './download-course.component.html',
  styleUrls: ['./download-course.component.css'],
  standalone: true,
  providers: [HttpClient],
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    AvatarModule,
    TagModule,
    DividerModule,
    TooltipModule,
    AvatarModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    PaginatorModule
  ],
})
export class DownloadCourseComponent {
 
  documentsDialog: boolean = false;
  selectedCourseDocs: any[] = [];
  constructor(private _hrService: HrService) { }

  pageNumber = 1;
  totalPages = 2;
  @Input() visible: boolean = false;
  @Input() courseDocs: any[] = [];
@Output() visibleChange = new EventEmitter<boolean>();
  closeDialog() {
    this.visible = false;
     this.visibleChange.emit(false); 
  }

//  downloadDoc(doc: any) {
//   const link = document.createElement('a');
//   link.href = doc.url;
//   link.download = doc.name || 'file';
//   link.click();
// }
downloadDoc(doc: any) {
  this._hrService.downloadMedia(doc.id).subscribe((file: Blob) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name || 'file';
    link.click();
    window.URL.revokeObjectURL(url);
  });
}

  trackByIndex(index: number): number {
    return index;
  }

  goToPrevious() {
    this.pageNumber--;
  }

  goToNext() {
    this.pageNumber++;
  }



}