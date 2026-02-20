import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import {
  allShiftsVM,
  assignCandidateToShiftVM,
  createShiftsVM,
  editAttendenceActivationVM,
  searchAllShiftsVM,
  searchCandidatesAssignation,
  searchCandidatesWeeklyStatusVM,
  searchGetAllShiftsDetailsForCandidateVM,
  startPauseVM,
  stopPauseVM,
  unAssignShiftVM,
} from '../../models/interfaces/attendance-vm';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private formatDateOnly(value: any): string {
    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value); // يحول string أو أي نوع مقارب إلى Date
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  constructor(private _apiService: ApiService) {}
  getCandidatesAssignation(
    searchViewModel: searchCandidatesAssignation,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.SearchText) {
      params = params.set('SearchText', searchViewModel.SearchText);
    }
    return this._apiService.get(
      `/GetAllCandidatesAssignationShiftEndpoint/GetAllCandidatesAssignation?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  getAllShifts(
    searchViewModel: searchAllShiftsVM,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.SearchText) {
      params = params.set('SearchText', searchViewModel.SearchText);
    }
    return this._apiService.get(
      `/GetAllShiftsEndpoint/GetAllShifts?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }
  removeShift(body: allShiftsVM) {
    return this._apiService.remove(`/DeleteShiftEndpoint/Delete`, body);
  }
  createShift(body: createShiftsVM): Observable<ResponseViewModel> {
    return this._apiService.post(`/CreateShiftEndPoint/CreateShift`, body);
  }
  editCourse(body: createShiftsVM): Observable<ResponseViewModel> {
    return this._apiService.update(`/EditShiftEndPoint/EditShift`, body);
  }
  getAllShiftsDetailsForCandidate(
    searchViewModel: searchGetAllShiftsDetailsForCandidateVM,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();

    if (searchViewModel.From) {
      params = params.set('From', this.formatDateOnly(searchViewModel.From));
    }
    if (searchViewModel.TO) {
      params = params.set('TO', this.formatDateOnly(searchViewModel.TO));
    }
    if (searchViewModel.CandidateId) {
      params = params.set('CandidateId', searchViewModel.CandidateId);
    }
    return this._apiService.get(
      `/GetAllShiftsDetailsForCandidateEndPoint/GetAllShiftsDetailsForCandidate?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  getAllplannedShiftsByCandidateId(candidateId: string) {
    return this._apiService.get(
      `/GetAllPlannedShiftsByCandidateIdEndpoint/GetAllPlannedShiftsByCandidateId?CandidateId=${candidateId}`
    );
  }

  getCandidateDataByCandidateId(candidateId: string) {
    return this._apiService.get(
      `/GetCandidateDataEndPoint/GetCandidateData?CandidateId=${candidateId}`
    );
  }

  getAttendeceCircleByCandidateId(candidateId: string) {
    return this._apiService.get(
      `/GetAttendanceCircleEndPoint/GetAttendanceCircle?CandidateId=${candidateId}`
    );
  }
  assignCandidateToShift(
    body: assignCandidateToShiftVM
  ): Observable<ResponseViewModel> {
    return this._apiService.post(
      `/AssignCandidateToShiftEndPoint/AssignCandidateToShift`,
      body
    );
  }

  unassigneShift(body: unAssignShiftVM): Observable<ResponseViewModel> {
    return this._apiService.update(
      `/UnassignCandidateToShiftEndPoint/UnassignCandidateToShift`,
      body
    );
  }

  startPause(body: startPauseVM): Observable<ResponseViewModel> {
    return this._apiService.post(`/StartPauseEndpoint/StartPause`, body);
  }

  stopPause(body: stopPauseVM): Observable<ResponseViewModel> {
    return this._apiService.update(`/StopPauseEndpoint/StopPause`, body);
  }

  getCandidateAttendenceActivation(candidateId: string) {
    return this._apiService.get(
      `/GetCandidateAttendanceActivationEndpoint/GetCandidateAttendanceActivation?ID=${candidateId}`
    );
  }
  editAttendenceActivation(
    body: editAttendenceActivationVM
  ): Observable<ResponseViewModel> {
    return this._apiService.update(
      `/EditCandidateAttendanceActivationEndpoint/EditCandidateAttendanceActivation`,
      body
    );
  }

  getCandidatesWeeklyStatus(
    searchViewModel: searchCandidatesWeeklyStatusVM,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.SearchText) {
      params = params.set('SearchText', searchViewModel.SearchText);
    }
    if (searchViewModel.StartDate) {
      params = params.set(
        'StartDate',
        this.formatDateOnly(searchViewModel.StartDate)
      );
    }

    if (searchViewModel.EndDate) {
      params = params.set(
        'EndDate',
        this.formatDateOnly(searchViewModel.EndDate)
      );
    }

    return this._apiService.get(
      `/GetCandidatesWeeklyStatusEndpoint/GetAllCandidatesWeeklyStatus?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }
}
