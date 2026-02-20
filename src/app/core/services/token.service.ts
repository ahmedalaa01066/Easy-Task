import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    const token = 'Bearer ' + localStorage.getItem('token');
    return token || '';
  }
}
