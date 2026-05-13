import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getToken, normalizeRole, getUserRole } from '../../shared/auth-utils';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (!getToken()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const roleGuard = (allowed: string[]): CanActivateFn => () => {
  const router = inject(Router);
  if (!getToken()) {
    router.navigate(['/login']);
    return false;
  }
  if (!allowed.includes(normalizeRole(getUserRole()))) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
