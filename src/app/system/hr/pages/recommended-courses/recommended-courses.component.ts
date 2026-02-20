import { Component, Input } from '@angular/core';
import {
  CreateRecommendedCoursesViewModel,
  SearchRecommendedCoursesViewModel,
} from '../../models/interfaces/recommended-courses-view-model';
import { HrService } from '../../services/hr.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { RecommendedCoursesListComponent } from '../../components/recommended-course/recommended-courses-list/recommended-courses-list.component';
import { AddRecommendedCoursesComponent } from '../../components/recommended-course/add-recommended-courses/add-recommended-courses.component';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CourseDetailsComponent } from '../../components/recommended-course/course-details/course-details.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recommended-courses',
  templateUrl: './recommended-courses.component.html',
  styleUrls: ['./recommended-courses.component.css'],
  standalone: true,
  providers: [HrService, SharedService],
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    TableModule,
    FormsModule,
    RecommendedCoursesListComponent,
    AddRecommendedCoursesComponent,
    CourseDetailsComponent,
  ],
})
export class RecommendedCoursesComponent {
  // Expose enum to template
  showDownloadOptions = false;
  searchTerm: string = '';
  selectedCourseId: string | null = null;
  searchViewModel: SearchRecommendedCoursesViewModel =
    new SearchRecommendedCoursesViewModel();

  // Modal visibility
  showAddRecommendedCourseModal: boolean = false;

  /**
   * Handle tab change
   * @param tabType - The selected tab type
   */
  constructor(
    private readonly _hrService: HrService,
    private readonly _sharedService: SharedService,
    private router: Router
  ) { }

  /**
   * Handle add recommendedCourse action
   */
  onAddRecommendedCourses(): void {
    this.showAddRecommendedCourseModal = true;
  }

  /**
   * Handle recommendedCourse creation from modal
   * @param recommendedCourseData - The recommendedCourse form data
   */
  onRecommendedCoursesAdded(event: { data: CreateRecommendedCoursesViewModel, tab: 'new' | 'existing' }): void {

    if (event.tab === 'existing') {
      this.showAddRecommendedCourseModal = false;
    }
  }




}
