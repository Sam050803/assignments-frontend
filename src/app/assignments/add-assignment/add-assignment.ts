import { Component, OnInit, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './add-assignment.html',
  styleUrl: './add-assignment.css'
})
export class AddAssignment implements OnInit {
  // @Output() nouvelAssignment = new EventEmitter<Assignment>();

  nomAssignment: string = '';
  dateDeRendu: Date = new Date();
  
  constructor(
    private assignmentsService: AssignmentsService, 
    private route: ActivatedRoute,
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

  onAjouterAssignment(event: any) {
    console.log("Ajout NOM = " + this.nomAssignment + " DATE = " + this.dateDeRendu);

    //on Crée un nouvel assignment
    const newAssignment = new Assignment();
    newAssignment.id = Math.floor(Math.random() * 100000);
    newAssignment.nom = this.nomAssignment;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = false;

    //on l'ajoute à la liste des assignments
    // this.nouvelAssignment.emit(newAssignment);
    this.assignmentsService.addAssignment(newAssignment)
      .subscribe(message => {
        console.log(message);
        this.router.navigate(['/home']);
      });
  }

}
