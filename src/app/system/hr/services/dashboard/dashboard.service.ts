import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { searchCourses, searchEmployeeAttendence } from '../../models/interfaces/dashboard';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private _apiService: ApiService) {}

  getAttendance() {
    return this._apiService.get(
      `/GetTodayAttendanceEndPoint/GetTodayAttendance`
    );
  }

  getRecommendedCourses(
    searchViewModel: searchCourses,
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
      `/GetAllCouesesWithCandidateNumberEndPoint/GetAllCoursesWithCandidateNumber?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  
 getEmployeeAttendanceGraph(searchViewModel: searchEmployeeAttendence) {
  let params = new HttpParams();

  if (searchViewModel.FromDate && searchViewModel.ToDate) {
    params = params
      .set('FromDate', searchViewModel.FromDate)
      .set('ToDate', searchViewModel.ToDate);
  }

  return this._apiService.get(
    `/GetEmployeeAttendanceGraphEndPoint/GetEmployeeAttendanceGraph`,
    params
  );
}


  getcourseStatistics() {
    return this._apiService.get(
      `/GetCoursesStatisticsEndpoint/GetCourseStatistics`
    );
  }
  getLevelStatistics() {
    return this._apiService.get(
      `/GetLevelsStatisticsEndpoint/GetLevelStatistics`
    );
  }
}
