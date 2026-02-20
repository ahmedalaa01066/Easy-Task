import { throwError as observableThrowError, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LocalizationService } from './localization.service';
import { ResponseViewModel } from '../models/response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
   apiUrl: string = environment.api;

  constructor(
    protected tokenService: TokenService,
    protected http: HttpClient,
    protected localizationService: LocalizationService,
    protected _router: Router,
  ) { }


  getApiUrl() {
    this.apiUrl = environment.api
  }

  // Request options
  private setHeaders(withFiles: boolean = false): HttpHeaders {
    let headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      lang: this.localizationService.getLanguage(),
      Authorization:  this.tokenService.getToken(),
    }
    let headersConfigWithImage = {
      Accept: 'application/json',
      lang: this.localizationService.getLanguage(),
      Authorization:this.tokenService.getToken(),
    };
    if (withFiles) return new HttpHeaders(headersConfigWithImage);
    else return new HttpHeaders(headersConfig);

  }

  private formatErrors(error: any) {
    // console.log('Error in API Service:', error);
    
    // if (error.status == 401) {
    //   // this._sharedService.logOut()
    //   this._router.navigate(['/login']);
    // } else if (error.status == 500) {
    //   this._alertService.error('حدث خطأ من فضلك حاول لاحقاً');
    // } else if (error.status == 404) {
    //   this._alertService.error('حدث خطأ من فضلك حاول لاحقاً');
    // }
    // this._logService.addToConsole(error);
    return observableThrowError(error);
  }

  // GET request method
  get(path: string, params?: HttpParams): Observable<ResponseViewModel> {
    this.getApiUrl();
    return this.http.get<ResponseViewModel>(`${this.apiUrl}${path}`, { headers: this.setHeaders(), params }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: ResponseViewModel) => res)
    );
  }

  getExcel(path: string, params?: HttpParams): Observable<Blob> {
    this.getApiUrl();
    return this.http.get(`${this.apiUrl}${path}`, {
      headers: this.setHeaders(),
      params,
      responseType: 'blob', // Ensures the response is treated as a binary file
    }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: Blob) => res) // Map the response to a Blob
    );
  }
  
  // POST request method
  post(path: string, body: Object = {}, withFiles = false, withAuth: boolean = false): Observable<ResponseViewModel> {
    this.getApiUrl();
    return this.http.post<ResponseViewModel>(`${this.apiUrl}${path}`, body, { headers: this.setHeaders(withFiles) }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: ResponseViewModel) => res)
    );
  }

  // PUT request method for updating
  update(path: string, body: Object = {}, withFiles = false, withAuth: boolean = false): Observable<ResponseViewModel> {
    this.getApiUrl();
    return this.http.put<ResponseViewModel>(`${this.apiUrl}${path}`, body, { headers: this.setHeaders(withFiles) }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: ResponseViewModel) => res)
    );
  }

  // DELETE request method
  remove(path: string, body?: Object): Observable<ResponseViewModel> {
    this.getApiUrl();
    return this.http.delete<ResponseViewModel>(`${this.apiUrl}${path}`, { body, headers: this.setHeaders() }).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res: ResponseViewModel) => res)
    );
  }
  getImages(path: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${path}`, { responseType: 'blob' });
  }

  getFromGoogle(path: string) {
    return this.http.get(`${path}`);
  }

  getFiles(path: string, params?: HttpParams): Observable<Blob> {
    this.getApiUrl()
    return this.http.get(`${this.apiUrl}${path}`, {
      responseType: 'blob',
      headers: this.setHeaders(true),
      params,
    });
  }

  removeAttachment(path: string): Observable<ResponseViewModel> {
    this.getApiUrl()

    return this.http.get<ResponseViewModel>(`${this.apiUrl}${path}`, { headers: this.setHeaders() })
      .pipe(map((res: ResponseViewModel) => res));
  }

  postMedia(path: string, param: FormData, isMultipart: boolean): Observable<any> {
    this.getApiUrl();
  
    // 'isMultipart' flag is not necessary here unless you're doing specific header manipulations
    return this.http.post(`${this.apiUrl}${path}`, param).pipe(
      catchError(this.formatErrors),
      map((res: any) => res)
    );
  }

}
