import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  }
  
  const loginUrl = '/login';
  if (route.url[0].path === 'login') {
    return true;
  }

  window.location.href  = loginUrl;
  return false;
};
