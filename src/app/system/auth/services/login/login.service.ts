import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { LoginViewModel, UserViewModel } from '../../interface/login/login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userInfo: UserViewModel;
  userLoading: boolean = true;


  constructor(private _apiService: ApiService) { }


  setLogin(userData: LoginViewModel) {
    return this._apiService.post(`/LoginEndPoint/Post`, userData);
  }

 endAttendence(ID: string) {
  const body = { id: ID }; 
  return this._apiService.update(`/EndAttendanceEndPoint/EndAttendance`, body);
}

  getUserInfo() {
    return this._apiService.get('/UserDataEndpoint/GetUserData');
  }

}
