import { Injectable } from '@angular/core';
import { createPermissionRequestViewModel, CreateVacationRequestViewModel, SearchCandidateRequestViewModel, SearchPermissionRequestViewModel } from '../../models/interfaces/candidate-request-vm';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateRequestService {

  constructor(private _apiService: ApiService) { }


  getCandidateRequests(
    searchViewModel: SearchCandidateRequestViewModel,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ): Observable<ResponseViewModel> {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.VacationRequestStatus) {
      params = params.set('VacationRequestStatus', searchViewModel.VacationRequestStatus);
    }
    if (searchViewModel.IsSpecial) {
      params = params.set('IsSpecial', searchViewModel.IsSpecial);
    }
    return this._apiService.get(
      `/GetAllVacationRequestsEndpoint/GetAllVacationRequests?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }


  postOrUpdateVacationRequest(
    body: any
  ): Observable<ResponseViewModel> {
    if (body.id)
      return this._apiService.update(
        `/EditVacationRequestEndPoint/EditVacationRequest`,
        body
      );
    else
      return this._apiService.post(
        `/CreateVacationRequestEndpoint/CreateVacationRequest`,
        body
      );
  }

  postOrUpdatePermissionRequest(
    body: any
  ): Observable<ResponseViewModel> {
    if (body.id)
      return this._apiService.update(
        `/EditPermissionRequestEndpoint/EditPermissionRequest`,
        body
      );
    else
      return this._apiService.post(
        `/CreatePermissionRequestEndPoint/CreatePermissionRequest`,
        body
      );
  }
  getcandidateRequestById(id?: string) {
    return this._apiService.get(
      `/GetVacationRequestByIdEndpoint/GetVacationRequestByID?ID=${id}`
    );
  }
  getPermissionRequestById(id?: string) {
    return this._apiService.get(
      `/GetPermissionRequestByIdEndpoint/GetPermissionRequestByID?ID=${id}`
    );
  }

  getVacationList() {
    return this._apiService.get(
      `/VacationsSelectListEndpoint/VacationsSelectList`
    );
  }
  getPermissionList() {
    return this._apiService.get(
      `/PermissionSelectListEndpoint/PermissionSelectList`
    );
  }


  getPermissionRequests(
    searchViewModel: SearchPermissionRequestViewModel,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ): Observable<ResponseViewModel> {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.Status) {
      params = params.set('Status', searchViewModel.Status);
    }
    return this._apiService.get(
      `/GetAllPermissionRequestsEndpoint/GetAllPermissionRequests?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }
}
