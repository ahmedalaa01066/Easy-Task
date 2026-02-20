import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { CreateSpecialDayViewModel, searchSpecialDayViewModel } from '../../models/interfaces/special-days-vm';
import { Observable } from 'rxjs';
import { ResponseViewModel } from 'src/app/core/models/response.model';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpecialDaysService {

  constructor(private _apiService: ApiService) { }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  getSpecialDays(
    searchViewModel: searchSpecialDayViewModel,
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
    if (searchViewModel?.From) {
      params = params.set('From', this.formatDate(searchViewModel.From));
    }
    if (searchViewModel?.To) {
      params = params.set('To', this.formatDate(searchViewModel.To));
    }

    return this._apiService.get(
      `/GetAllSpecialDaysEndPoint/GetAllSpecialDays?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      params
    );
  }

  createSpecialDay(
    body: CreateSpecialDayViewModel
  ): Observable<ResponseViewModel> {
    return this._apiService.post(
      `/AddSpecialDayEndpoint/AddSpecialDay`,
      body
    );
  }
  getSpecialDayById(id?: string) {
    return this._apiService.get(
      `/GetSpecialDayByIdEndPoint/GetSpecialDayById?ID=${id}`
    );
  }


  editSpecialDay(body: CreateSpecialDayViewModel): Observable<ResponseViewModel> {
    return this._apiService.update(
      `/EditSpecialDayEndPoint/EditSpecialDay`,
      body
    );
  }

   removeSpecialDay(body: any) {
    return this._apiService.remove(
      `/DeleteSpecialDayEndPoint/DeleteSpecialDay`,
      body
    );
  }
}
