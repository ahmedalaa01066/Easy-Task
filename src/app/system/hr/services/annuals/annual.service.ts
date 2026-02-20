import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import {
  createRequestTypeViewModel,
  deleteRequestTypeViewModel,
  searchRequestTypeViewModel,
} from '../../models/interfaces/annual';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AnnualService {
  constructor(private _apiService: ApiService) {}

  getAnnuals(
    searchViewModel: searchRequestTypeViewModel,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ): Observable<ResponseViewModel> {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set('Name', searchViewModel.Name);
    }
    return this._apiService.get(
      `/GetAllVacationsEndpoint/GetAllVacations?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  deleteRequestType(
    body: deleteRequestTypeViewModel
  ): Observable<ResponseViewModel> {
    return this._apiService.remove(
      `/DeleteVacationEndpoint/DeleteVacation`,
      body
    );
  }
  postOrUpdateRequestType(
    body: createRequestTypeViewModel
  ): Observable<ResponseViewModel> {
    if (body.id)
      return this._apiService.update(
        `/EditVacationEndPoint/EditVacation`,
        body
      );
    else
      return this._apiService.post(
        `/CreateVacationEndPoint/CreateVacation`,
        body
      );
  }
}
