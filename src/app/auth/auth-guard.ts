import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // si connecté, OK
  if (auth.isLoggedIn()) return true;

  // sinon, redirige vers /login?returnUrl=<page demandée>
  const tree: UrlTree = router.createUrlTree(
    ['/login'],
    { queryParams: { returnUrl: location.pathname + location.search } }
  );
  return tree;
};
