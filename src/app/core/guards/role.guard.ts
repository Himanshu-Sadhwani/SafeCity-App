import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';

function getUserRoles(): string[] {
    const storedRoles = localStorage.getItem('userRoles');

    if (!storedRoles) {
        return [];
    }

    try {
        const roles = JSON.parse(storedRoles);
        return Array.isArray(roles) ? roles : [];
    } catch {
        return [];
    }
}

function getAllowedRoles(route: ActivatedRouteSnapshot): string[] {
    const roles = route.data['roles'];
    return Array.isArray(roles) ? roles : [];
}

export const roleGuard: CanActivateFn = (route) => {
    const router = inject(Router);
    const allowedRoles = getAllowedRoles(route);

    if (allowedRoles.length === 0) {
        return true;
    }

    const userRoles = getUserRoles();
    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

    if (hasAccess) {
        return true;
    }

    return router.createUrlTree(['/login']);
};
