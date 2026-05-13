import { HttpInterceptorFn } from '@angular/common/http';
import { getToken } from '../../shared/auth-utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();
  if (!token) return next(req);
  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(cloned);
};
