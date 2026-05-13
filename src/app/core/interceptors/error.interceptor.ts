import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TOKEN_KEY, USER_KEY, REFRESH_KEY } from '../../shared/constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(REFRESH_KEY);
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

export function extractError(err: any, fallback = 'Something went wrong.'): string {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  const body = err?.error;
  if (typeof body === 'string') return body || fallback;
  return body?.message || body?.error || err?.message || fallback;
}
