import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import {
  CreateHierarchyViewModel,
  SearchHierarcyiewModel,
} from '../../models/interfaces/hierarchy-view-model';
import { Observable } from 'rxjs';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HierarchyService {
  constructor(private _apiService: ApiService) {}
  getAllLevel: EventEmitter<void> = new EventEmitter<void>();

  getAllLevels() {
    return this._apiService.get('/GetAllLevelsEndpoint/GetAllLevels');
  }

  getNextLevel() {
    return this._apiService.get(
      '/GetNextLevelSequenceEndPoint/GetNextLevelSequence'
    );
  }

  createHierarchy(
    body: CreateHierarchyViewModel
  ): Observable<ResponseViewModel> {
    return this._apiService.post(`/AddLevelEndpoint/Post`, body);
  }
  getAllHierarchyLevels(
    searchViewModel: SearchHierarcyiewModel,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ): Observable<ResponseViewModel> {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.num) {
      params = params.set('num', searchViewModel.num);
    }
    return this._apiService.get(
      `/LevelHierarchyEndpoint/LevelHierarchy?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }
  editHierarchy(body: CreateHierarchyViewModel): Observable<ResponseViewModel> {
    return this._apiService.update(`/EditLevelEndPoint/EditLevel`, body);
  }
}
