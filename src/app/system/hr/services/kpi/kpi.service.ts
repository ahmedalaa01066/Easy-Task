import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import {
  createDefaultKpiViewModel,
  createKpiViewModel,
  defaultKpiViewModel,
  deleteDefaultKpiViewModel,
  searchKpiViewModel,
} from '../../models/interfaces/kpi-view-model';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseViewModel } from 'src/app/core/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class KpiService {
  constructor(private _apiService: ApiService) {}

  getKPIs(
    searchViewModel: searchKpiViewModel,
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
      `/GetAllCandidatesWithKPIsEndPoint/GetAllCandidatesWithKPIs?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  createKPI(body: createKpiViewModel): Observable<ResponseViewModel> {
    return this._apiService.post(
      `/AssignKPIToCandidateEndPoint/AssignKPIToCandidate`,
      body
    );
  }

  getDefaultKPIs(
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();

    return this._apiService.get(
      `/GetAllDefaultKPIsEndPoint/GetAllDefaultKPIs?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  createDefaultKPI(
    body: createDefaultKpiViewModel
  ): Observable<ResponseViewModel> {
    return this._apiService.post(
      `/CreateDefaultKPIEndPoint/CreateDefaultKPI`,
      body
    );
  }

    deleteDefaultKPI(body: deleteDefaultKpiViewModel): Observable<ResponseViewModel> {
    return this._apiService.remove(`/DeleteDefaultKPIEndpoint/Delete`, body);
  }
  
}
