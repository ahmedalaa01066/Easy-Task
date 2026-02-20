import { Injectable } from '@angular/core';
import { SearchPermissionRequestViewModel, searchRequestNotificationVM } from '../../models/interfaces/request-notification-vm';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _apiService: ApiService) {}
  getNotificationRequests(
    searchViewModel: searchRequestNotificationVM,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ): Observable<ResponseViewModel> {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.VacationRequestStatus) {
      params = params.set(
        'VacationRequestStatus',
        searchViewModel.VacationRequestStatus
      );
    }
    if (searchViewModel.IsSpecial) {
      params = params.set('IsSpecial', searchViewModel.IsSpecial);
    }
    return this._apiService.get(
      `/GetAllVacationRequestsEndpoint/GetAllVacationRequests?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
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
