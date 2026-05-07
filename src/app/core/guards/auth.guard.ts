import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

function hasToken(): boolean {
    return !!localStorage.getItem('authToken');
}

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);

    if (hasToken()) {
        return true;
    }

    return router.createUrlTree(['/login']);
};
