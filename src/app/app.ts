import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterLink, RouterOutlet, Router, RouterLinkActive } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from "./shared/auth.service";
import { AssignmentsService } from "./shared/assignments.service";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatButtonModule, 
    MatIconModule,
    CommonModule
  ],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})
export class App implements OnInit, OnDestroy {
  title = 'Application de gestion des assignments';
  isLoggedIn = false;
  currentUserRole: string = '';
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private assignmentsService: AssignmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateLoginStatus();
    // S'abonner aux changements d'authentification
    this.authSubscription = this.authService.authStatus$.subscribe(() => {
      this.updateLoginStatus();
    });
  }

  ngOnDestroy(): void {
    // Nettoyer l'abonnement
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  updateLoginStatus() {
    this.isLoggedIn = this.authService.isLogged();
    const user = this.authService.getCurrentUser();
    this.currentUserRole = user ? user.role : '';
  }

  logout() {
    this.authService.logout();
    this.updateLoginStatus();
    this.router.navigate(['/home']);
  }

  peuplerBD() {
    console.log('Peuplement de la base de données...');
    this.assignmentsService.peuplerBD().subscribe({
      next: (result: any) => {
        console.log('Peuplement réussi !', result);
        if (result.count === 0) {
          alert('Tous les assignments existent déjà dans la base de données.');
        } else {
          alert(`${result.count} assignments ajoutés avec succès !\nTotal dans la BD: ${result.total}`);
        }
      },
      error: (error) => {
        console.error('Erreur lors du peuplement:', error);
        alert('Erreur lors du peuplement de la base de données');
      }
    });
  }
}