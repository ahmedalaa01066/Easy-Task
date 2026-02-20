import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import {
  CreateRecommendedCoursesViewModel,
  editCourse,
  RecommendedCoursesViewModel,
  SearchRecommendedCoursesViewModel,
} from '../../models/interfaces/recommended-courses-view-model';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendedCoursesService {
  constructor(private _apiService: ApiService) {}
  getAllRecommendedCourses: EventEmitter<void> = new EventEmitter<void>();
  getRecommendedCourses(
    searchViewModel: SearchRecommendedCoursesViewModel,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set('Name', searchViewModel.Name);
    }
    return this._apiService.get(
      `/GetAllCoursesEndPoint/GetAllCourses?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }
  removeCourse(body: RecommendedCoursesViewModel) {
    return this._apiService.remove(`/DeleteCourseEndpoint/DeleteCourse`, body);
  }

  assignCourse(
    body: CreateRecommendedCoursesViewModel
  ): Observable<ResponseViewModel> {
    return this._apiService.post(
      `/AssignCandidatesToCourseEndPoint/AssignCandidatesToCourse`,
      body
    );
  }
  unassignManagementFromCourse(courseId: string, managementIds: string[]) {
    const queryParams = managementIds
      .map((id) => `managementIds=${encodeURIComponent(id)}`)
      .join('&');
    const url = `/UnassignManagmentFromCourseEndPoint/UnassignManagmentFromCourse?courseId=${encodeURIComponent(
      courseId
    )}&${queryParams}`;
    return this._apiService.update(url, null);
  }

   GetAllCandidatesForCourse(courseId: string) {
    let params = new HttpParams();
    return this._apiService.get(
      `/GetAllCandidatesForCourseEndPoint/GetAllCandidatesForCourse?CourseId=${courseId}`,
      params
    );
  }
  unassignCandidatesFromCourse(courseId: string, candidateIds: string[]) {
    const queryParams = candidateIds
      .map((id) => `candidateIds=${encodeURIComponent(id)}`)
      .join('&');
    const url = `/UnassignCandidateCourseEndPoint/UnassignCandidateCourse?courseId=${encodeURIComponent(
      courseId
    )}&${queryParams}`;
    return this._apiService.update(url, null);
  }
  getCourseById(courseId: string) {
    return this._apiService.get(
      `/GetCourseByIdEndPoint/GetCourseById?ID=${courseId}`
    );
  }

  editCourse(body: editCourse): Observable<ResponseViewModel> {
    return this._apiService.update(`/EditCourseEndPoint/EditCourse`, body);
  }
}
