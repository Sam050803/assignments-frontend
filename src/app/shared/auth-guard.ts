import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);

  // Vérifier d'abord si l'utilisateur est connecté
  if (!authService.isLogged()) {
    console.log("Vous n'êtes pas connecté, navigation refusée !");
    router.navigate(['/home']);
    return false;
  }

  // Ensuite vérifier si c'est un admin (pour l'édition)
  return authService.isAdmin().then(isAdmin => {
    if (isAdmin) {
      console.log("Vous êtes admin, navigation autorisée !");
      return true;
    } else {
      console.log("Vous n'êtes pas admin, navigation refusée !");
      router.navigate(['/home']);
      return false;
    }
  });
};
