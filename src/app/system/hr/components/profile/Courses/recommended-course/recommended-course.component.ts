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
import { CRUDIndexPage } from 'src/app/shared/interfaces/crud-index.model';
import { startCourseVM } from '../../../../models/interfaces/profile-details-view-model';

@Component({
  selector: 'app-recommended-course',
  templateUrl: './recommended-course.component.html',
  styleUrls: ['./recommended-course.component.css'],
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
export class RecommendedCourseComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() candidateId!: string;
  courses: any[] = [];
  page: CRUDIndexPage = new CRUDIndexPage();
  totalRecords: number = 0;
  pageNumber: number = 1;
  totalPages: number = 0;

  rows: number = 2;


  CourseClassification = [
    { name: 'Online', id: 1 },
    { name: 'Offline', id: 2 },
    { name: 'SelfStudy', id: 3 },
  ];


  CourseStatus = [
    { name: 'Obligatory', id: 1 },
    { name: 'Optional', id: 2 },
  ]


  HasExam = [
    { name: 'No', id: 1 },
    { name: 'Yes', id: 2 }
  ]

  CourseType = [
    { name: 'Internal', id: 1 },
    { name: 'External', id: 2 },
  ]

  Assigment = [
    { name: 'Assigned', id: 1 },
    { name: 'PartiallyAssigned', id: 2 },
    { name: 'Unassigned', id: 3 },
  ]
  constructor(private _hrService: HrService) { }
  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this._hrService.getAllCoursesInProfile(
      this.candidateId,
      this.page.orderBy,
      this.page.isAscending,
      this.pageNumber,
      this.rows
    ).subscribe({
      next: (res: any) => {
        this.courses = res.data.items;

        this.totalRecords = res.data.records;
        this.totalPages = res.data.pages;
        this.pageNumber = res.data.pageIndex;
        this.rows = res.data.pageSize;
      },
      error: (err) => {
        console.error('Error loading courses', err);
      },
    });
  }

  goToPrevious() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getCourses();
    }
  }

  goToNext() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getCourses();
    }
  }
  getCourseTypeName(id: number): string {
    const item = this.CourseType.find(type => type.id === id);
    return item ? item.name : 'Unknown';
  }

  getClassificationName(id: number): string {
    const item = this.CourseClassification.find(classification => classification.id === id);
    return item ? item.name : 'Unknown';
  }

  getStatusName(id: number): string {
    const item = this.CourseStatus.find(status => status.id === id);
    return item ? item.name : 'Unknown';
  }

  formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

startCourse(course: any) {
  
  const body: startCourseVM = {
    "candidateId": this.candidateId,
    "courseId": course.id,
    "actualStartDate": this.formatDateOnly(new Date())
  };

  this._hrService.startCourse(body).subscribe({
    next: () => {
      this.getCourses(); 
    },
    error: (err) => {
      console.error('Error starting course:', err);
    }
  });
}


}
