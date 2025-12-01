import { Component, OnInit, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../../shared/capitalize.pipe';

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    CapitalizePipe
  ],
  templateUrl: './edit-assignment.html',
  styleUrl: './edit-assignment.css',
}) export class EditAssignmentComponent implements OnInit {
  assignment: Assignment | undefined;
  // Pour les champs de formulaire
  nomAssignment = '';
  dateDeRendu?: Date = undefined;

  constructor(
    private assignmentsService: AssignmentsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // Forcer la détection de changement après le rendu initial
    afterNextRender(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.getAssignment();

    // affichage des queryParams et fragment
    console.log("Query Params :");
    console.log(this.route.snapshot.queryParams);
    console.log("Fragment : ");
    console.log(this.route.snapshot.fragment);
    
    // Forcer la détection de changement au chargement
    this.cdr.detectChanges();
  }

  getAssignment() {
    // On va utiliser ActivatedRoute pour lire l'id dans l'URL
    const id = +this.route.snapshot.params['id'];
    this.assignmentsService.getAssignment(id)
      .subscribe(a => {
        this.assignment = a;
        if (a === undefined) return;
        this.nomAssignment = a.nom;
        this.dateDeRendu = a.dateDeRendu;
        // Forcer la détection de changement après avoir récupéré les données
        this.cdr.detectChanges();
      });
  }

  onSaveAssignment() {
    if (!this.assignment) return;
    if (this.nomAssignment == '' || this.dateDeRendu === undefined) return;

    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((message) => {
        console.log(message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
  }
}

