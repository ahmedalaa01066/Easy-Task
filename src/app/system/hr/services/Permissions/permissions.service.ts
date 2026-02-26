import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { Observable } from 'rxjs';
import { CreatePermissionViewModel, SearchPermissionViewModel } from '../../models/interfaces/permissions-vm';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private _apiService: ApiService) {}

    getAllPermissions: EventEmitter<void> = new EventEmitter<void>();
  
  getPermissiona(
    searchViewModel: SearchPermissionViewModel,
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
      `/GetAllPermissionsEndpoint/GetAllPermissions?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }


  postOrUpdateCandidate(
      body: CreatePermissionViewModel
    ): Observable<ResponseViewModel> {
      if (body.id)
        return this._apiService.update(
          `/EditPermissionEndPoint/EditPermission`,
          body
        );
      else
        return this._apiService.post(
          `/CreatePermissionEndPoint/CreatePermission`,
          body
        );
    }
}
