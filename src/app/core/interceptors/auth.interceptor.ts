import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.test';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem(environment.tokenKey);

    if (!token) {
        return next(req);
    }

    const authRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });

    return next(authRequest);
};
