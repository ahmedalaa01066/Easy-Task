import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import {
  CreateCandidateViewModel,
  SearchCandidateViewModel,
} from '../../models/interfaces/candidate-view-models';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private _apiService: ApiService) {}

  getAllCandidate: EventEmitter<void> = new EventEmitter<void>();
  getCandidates(
    searchViewModel: SearchCandidateViewModel,
    orderBy: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number = 0
  ): Observable<ResponseViewModel> {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.candidateStatus) {
      params = params.set('CandidateStatus', searchViewModel.candidateStatus);
    }
    return this._apiService.get(
      `/GetAllCandidatesEndPoint/GetAllCandidates?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  postOrUpdateCandidate(
    body: CreateCandidateViewModel
  ): Observable<ResponseViewModel> {
    if (body.id)
      return this._apiService.update(
        `/EditCandidateEndPoint/EditCandidate`,
        body
      );
    else
      return this._apiService.post(
        `/CreateCandidateEndpoint/CreateCandidate`,
        body
      );
  }

  getCandidateExcel(
    searchViewModel: SearchCandidateViewModel
  ): Observable<Blob> {
    let params = new HttpParams();
    if (searchViewModel.candidateStatus) {
      params = params.set('candidateStatus', searchViewModel.candidateStatus);
    }

    return this._apiService.getFiles(
      `/ExportCandidatesEndpoint/ExportCandidates`,
      params
    );
  }
}
