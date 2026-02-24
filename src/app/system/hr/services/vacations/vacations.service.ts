import { editVacationVM } from './../../models/interfaces/vacations';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { searchVacationsVM } from '../../models/interfaces/vacations';
import { environment } from 'src/environments/environment.prod';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacationsService {
 constructor(private _apiService: ApiService) {}

  getAllVacations(
    searchViewModel: searchVacationsVM,
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
      `/GetAllCandidateVacationsEndpoint/GetAllCandidatesVacations?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }
  editVacation(editVacationViewModel: editVacationVM) {
    return this._apiService.update(
      `/UpdateCandidateVacationDaysEndpoint/UpdateCandidateVacationDays`,
      editVacationViewModel
    );
  }
}
