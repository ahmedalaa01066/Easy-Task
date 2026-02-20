import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import {
  createNewPositionVM,
  JobVM,
  searchJobVM,
} from '../../models/interfaces/job-vm';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private _apiService: ApiService) {}

  getAllJobs(
    searchViewModel: searchJobVM,
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
      `/GetAllJobsEndpoint/GetAllJobs?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  creatJob(body: createNewPositionVM): Observable<ResponseViewModel> {
    return this._apiService.post(`/CreateJobEndPoint/CreateJob`, body);
  }
  removeJob(body: JobVM) {
    return this._apiService.remove(`/DeleteJobEndpoint/Delete`, body);
  }

  editJob(body: createNewPositionVM): Observable<ResponseViewModel> {
    return this._apiService.update(`/EditJobEndPoint/EditJob`, body);
  }
}
