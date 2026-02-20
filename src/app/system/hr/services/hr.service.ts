import {
  EditHierarchyinProfileViewModel,
  searchAttendanceProfileViewModel,
} from './../models/interfaces/profile-details-view-model';
import { HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { ApiService } from 'src/app/core/services/api.service';
import { Observable } from 'rxjs';
import { ResponseViewModel } from 'src/app/core/models/response.model';

import {
  addDocumentViewModel,
  createPenaltiyViewModel,
  editBioViewModel,
  editPenaltiyViewModel,
  EditProfileViewModel,
  startCourseVM,
} from '../models/interfaces/profile-details-view-model';

@Injectable({
  providedIn: 'root',
})
export class HrService {
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 لأن الأشهر صفرية
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  constructor(private _apiService: ApiService) {}

  getDepartmentsByManagement(managementId?: string) {
    return this._apiService.get(
      `/SelectDepartmentListEndPoint/SelectDepartmentList?ManagementId=${managementId}`,
    );
  }
  getDepartments() {
    return this._apiService.get(
      `/SelectDepartmentListEndPoint/SelectDepartmentList`,
    );
  }
  getLevels() {
    return this._apiService.get('/LevelSelectListEndpoint/SelectLevelList');
  }

  getPositions() {
    return this._apiService.get(
      '/PositionSelectListEndPoint/PositionSelectList',
    );
  }

  uploadImage(files: File[], path: string) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('Files', file, file.name);
    });

    formData.append('Path', path);

    return this._apiService.postMedia(
      '/UploadMediaEndPoint/UploadMedia',
      formData,
      true,
    );
  }

  attachMediaToDocument(data: any) {
    return this._apiService.post(
      `/AttachMediaToDocumentEndpoint/AttachMediaToDocument`,
      data,
    );
  }

  selectCandidates() {
    return this._apiService.get(
      '/CandidateSelectListEndPoint/SelectCandidateList',
    );
  }

  getManagementList() {
    return this._apiService.get(
      '/SelectManagementListEndpoint/SelectManagementList',
    );
  }

  getManagementsInRecommendedCourses(CourseId?: string) {
    return this._apiService.get(
      `/SelectManagementListByCourseIdEndPoint/SelectManagementListByCourseId?CourseId=${CourseId}`,
    );
  }

  getDepartmentsByManagementIds(managementIds?: string[], courseId?: string) {
    let params = managementIds.map((id) => `ManagementIds=${id}`).join('&');

    let url = `/SelectDepartmentListByManagementIdsEndPoint/SelectDepartmentListByManagementIds?${params}`;

    if (courseId) {
      url += `&CourseId=${courseId}`;
    }

    return this._apiService.get(url);
  }

  getCandidatesByDepartmentIds(departmentIds?: string[], courseId?: string) {
    let url = `/SelectCandidateListByDepartmentIdsEndPoint/SelectCandidateListByDepartmentIds`;
    const params: string[] = [];
    if (departmentIds && departmentIds.length > 0) {
      params.push(departmentIds.map((id) => `DepartmentIds=${id}`).join('&'));
    }
    if (courseId) {
      params.push(`CourseId=${courseId}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._apiService.get(url);
  }

  getAllCoursesInRecommendedCourses() {
    return this._apiService.get('/SelectCourseListEndPoint/SelectCourseList');
  }

  getManagers() {
    return this._apiService.get('/ManagerSelectListEndpoint/ManagerSelectList');
  }
  getShifts() {
    return this._apiService.get('/ShiftSelectListEndPoint/SelectShiftList');
  }
  //profile
  getProfileDetails(id?: string) {
    return this._apiService.get(
      `/GetCandidateByIdEndPoint/GetCandidateById?ID=${id}`,
    );
  }

  //Edit Profile

  editProfile(body: EditProfileViewModel): Observable<ResponseViewModel> {
    return this._apiService.update(
      `/EditCandidateEndPoint/EditCandidate`,
      body,
    );
  }

  createPenalty(body: createPenaltiyViewModel): Observable<ResponseViewModel> {
    return this._apiService.post(`/AddPenalityEndPoint/AddPenality`, body);
  }

  getAllCoursesInProfile(
    CandidateId: string,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0,
  ) {
    return this._apiService.get(
      `/GetAllCoursesByCandidateIdEndpoint/GetAllCoursesByCandidateId?CandidateId=${CandidateId}&orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    );
  }

  //edit Bio
  editBio(body: editBioViewModel): Observable<ResponseViewModel> {
    return this._apiService.update(
      `/EditCandidateBioEndpoint/EditCandidateBio`,
      body,
    );
  }

  getAllPenaltiesInProfile(
    CandidateId: string,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0,
  ) {
    return this._apiService.get(
      `/GetPenalitiesByCandidateIdEndpoint/GetAllPenalitiesByCandidateId?CandidateId=${CandidateId}&orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    );
  }

  editPenalty(body: editPenaltiyViewModel): Observable<ResponseViewModel> {
    return this._apiService.update(`/EditPenalityEndPoint/EditPenality`, body);
  }
  removePenalty(body: any) {
    return this._apiService.remove(
      `/DeletePenalityEndpoint/DeletePenality`,
      body,
    );
  }

  getAllMedia(documentId?: string) {
    return this._apiService.get(
      `/GetAllMediaByDocumentIdEndpoint/GetAll?ParentDocumentId=${documentId}`,
    );
  }
  downloadMedia(id: string) {
    return this._apiService.getFiles(
      '/DownloadMediaEndpoint/DownloadMedia',
      new HttpParams().set('id', id),
    );
  }

  // add Document

  addDocument(body: addDocumentViewModel): Observable<ResponseViewModel> {
    return this._apiService.post(
      `/AttachMediaToDocumentEndpoint/AttachMediaToDocument`,
      body,
    );
  }
  //get Managar in Level of Profile

  GetManagerByCandidate(id?: string) {
    return this._apiService.get(
      `/GetManagerByCandidateIdEndpoint/GetManagerByCandidateId?ID=${id}`,
    );
  }
  //edit Level in Profile

  EditHierarchyinProfile(
    body: EditHierarchyinProfileViewModel,
  ): Observable<ResponseViewModel> {
    return this._apiService.update(
      `/EditCandidateLevelEndPoint/EditCandidateLevel`,
      body,
    );
  }

  startCourse(body: startCourseVM) {
    return this._apiService.update(
      `/SetActualStartDateEndPoint/SetActualStartDate`,
      body,
    );
  }

  getAllKPIsInProfile(CandidateId: string) {
    return this._apiService.get(
      `/GetAllKPIsByCandidateIdEndPoint/GetAllKPIsByCandidateId?CandidateId=${CandidateId}`,
    );
  }

  getAttendancesInProfile(
    searchViewModel: searchAttendanceProfileViewModel,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0,
    candidateId?: number | string,
  ) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();

    if (searchViewModel.From) {
      params = params.set(
        'From',
        this.formatDateToYYYYMMDD(searchViewModel.From),
      );
    }
    if (searchViewModel.To) {
      params = params.set('To', this.formatDateToYYYYMMDD(searchViewModel.To));
    }
    if (candidateId != null) {
      params = params.set('CandidateId', candidateId.toString());
    }

    return this._apiService.get(
      `/GetAllAttendancesForCandidateEndPoint/GetAllAttendancesForCandidate?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params,
    );
  }

  getCandidateVacationInProfile(CandidateId: string) {
    return this._apiService.get(
      `/GetCandidateVacationRemainingDaysEndpoint/GetCandidateVacationRemainingDays?CandidateId=${CandidateId}`,
    );
  }
  getAllLevels() {
    return this._apiService.get('/GetAllLevelsEndpoint/GetAllLevels');
  }

  
}
