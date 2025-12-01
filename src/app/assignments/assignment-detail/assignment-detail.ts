import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from '../assignment.model';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { Subscription } from 'rxjs';
import { CapitalizePipe } from '../../shared/capitalize.pipe';
import { FrenchDatePipe } from '../../shared/french-date.pipe';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [MatCardModule, MatCheckboxModule, MatIconModule, MatButtonModule, MatTooltipModule, RouterLink, CommonModule, CapitalizePipe, FrenchDatePipe],
  templateUrl: './assignment-detail.html',
  styleUrl: './assignment-detail.css'
})
export class AssignmentDetail implements OnInit, OnDestroy {

  @Output() assignmenSupprime = new EventEmitter<Assignment>();

  // @Input()
  assignmentTransmis!: Assignment;
  isLoggedIn = false;
  isAdminUser = false;
  private authSubscription?: Subscription;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { 
    // Mettre à jour le statut quand le composant est créé
    this.updateAuthStatus();
    // Forcer la détection de changement après le rendu initial
    afterNextRender(() => {
      this.cdr.detectChanges();
    });
  }

  onAssignmentRendu() {
    //  if(this.assignmentTransmis){
    //   this.assignmentTransmis.rendu = !this.assignmentTransmis.rendu;
    //  }
    this.assignmentTransmis.rendu = !this.assignmentTransmis.rendu;

    this.assignmentsService.updateAssignment(this.assignmentTransmis)
      .subscribe(message => {

        console.log(message);
        this.router.navigate(['/home']);
      });
  }

  onDelete() {
    if (!this.assignmentTransmis) return;
    this.assignmentsService.deleteAssignment(this.assignmentTransmis)
      .subscribe(message => { 
        console.log(message);
        this.router.navigate(['/home']);
      });

    this.assignmentTransmis = null!;
  }

  onAssignmentSupprime() {

    this.assignmenSupprime.emit(this.assignmentTransmis);
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
    this.getAssignment();
    this.updateAuthStatus();
    
    // S'abonner aux changements d'authentification
    this.authSubscription = this.authService.authStatus$.subscribe(() => {
      this.updateAuthStatus();
    });
    
    // Forcer la détection de changement au chargement
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // Nettoyer l'abonnement
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  updateAuthStatus() {
    this.isLoggedIn = this.authService.isLogged();
    const user = this.authService.getCurrentUser();
    // Vérifier directement le rôle de l'utilisateur actuel
    this.isAdminUser = this.authService.isLogged() && user?.role === 'admin';
  }

  // Getter qui vérifie directement le service à chaque appel
  get isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return this.authService.isLogged() && user?.role === 'admin';
  }

  getAssignment() {
    const id = +this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id)
      .subscribe(a => {
        this.assignmentTransmis = a!;
        // Forcer la détection de changement après avoir récupéré les données
        this.cdr.detectChanges();
      });
  }

  onClickEdit() {
    // if(!this.assignmentTransmis) return;
    this.router.navigate([`/assignment/${this.assignmentTransmis.id}/edit`],
      {queryParams:{nom:this.assignmentTransmis.nom}, fragment:'edition'}
    );
  }
}
