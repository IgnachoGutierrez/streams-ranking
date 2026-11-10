// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const CREDENTIALED_URLS = [
  `${environment.apiUrl}/auth/token`,
  `${environment.apiUrl}/auth/me`,
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!CREDENTIALED_URLS.includes(req.url)) {
    return next(req);
  }

  const cookieReq = req.clone({
    withCredentials: true,
  });

  return next(cookieReq);
};