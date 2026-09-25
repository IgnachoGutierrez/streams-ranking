// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

const CREDENTIALED_URLS = [
  'http://127.0.0.1:3000/auth/token',
  'http://127.0.0.1:3000/auth/me',
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