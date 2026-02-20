import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import {
  CreateManagementViewModel,
  EditManagementViewModel,
  SearchManagementViewModel,
} from '../../models/interfaces/management-view-models';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  constructor(private _apiService: ApiService) {}

  getManagements(
    searchViewModel: SearchManagementViewModel,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.name) {
      params = params.set('name', searchViewModel.name);
    }
    return this._apiService.get(
      `/GetAllManagementsEndPoint/GetAllManagements?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  createManagement(
    body: CreateManagementViewModel
  ): Observable<ResponseViewModel> {
    return this._apiService.post(
      `/CreateManagementEndPoint/AddManagement`,
      body
    );
  }

  editManagement(body: EditManagementViewModel): Observable<ResponseViewModel> {
    return this._apiService.update(
      `/EditManagementEndPoint/EditManagement`,
      body
    );
  }
  
}
