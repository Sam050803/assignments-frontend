import { Component, OnInit, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatIconModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  login: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Forcer la détection de changement après le rendu initial
    afterNextRender(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    // Forcer la détection de changement au chargement
    this.cdr.detectChanges();
  }

  onSubmit() {
    this.errorMessage = '';
    this.authService.logIn(this.login, this.password)
      .then(success => {
        if (success) {
          // Redirection vers la page d'accueil après connexion réussie
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Login ou mot de passe incorrect';
          this.cdr.detectChanges(); // Forcer l'affichage du message d'erreur
        }
      });
  }
}
