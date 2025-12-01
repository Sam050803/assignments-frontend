import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from './assignment.model';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AssignmentsService, PaginatedAssignments } from '../shared/assignments.service';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CapitalizePipe } from '../shared/capitalize.pipe';
import { FrenchDatePipe } from '../shared/french-date.pipe';
import { FrenchPaginatorIntl } from '../shared/french-paginator-intl';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
    CapitalizePipe,
    FrenchDatePipe
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: FrenchPaginatorIntl }
  ],
  templateUrl: './assignments.html',
  styleUrl: './assignments.css'
})
export class Assignments implements OnInit, AfterViewInit, OnDestroy {
  assignments: Assignment[] = [];
  displayedColumns: string[] = ['numero', 'nom', 'dateDeRendu', 'rendu'];
  dataSource = new MatTableDataSource<Assignment>();
  private routerSubscription?: Subscription;
  private assignmentsUpdateSubscription?: Subscription;
  private paginatorSubscription?: Subscription;

  // Propriétés pour la pagination
  pageSize = 15;
  pageIndex = 0;
  totalDocs = 0;
  pageSizeOptions = [5, 10, 15, 25, 50, 100];
  
  // Pour utiliser Math dans le template
  Math = Math;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private assignmentsService: AssignmentsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Forcer la détection de changement après le rendu initial
    afterNextRender(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.getAssignments();
    
    // Écouter les événements de navigation pour recharger les données
    // quand on revient sur cette page
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Recharger les données à chaque fois qu'on navigue vers /home
        if (event.url === '/home' || event.url === '/') {
          this.getAssignments();
        }
      });
    
    // Écouter les notifications du service pour recharger automatiquement
    this.assignmentsUpdateSubscription = this.assignmentsService.assignmentsUpdated.subscribe(() => {
      this.getAssignments();
    });
    
    // Forcer la détection de changement au chargement
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // Configurer le paginator pour qu'il déclenche les événements de pagination
    if (this.paginator) {
      this.paginatorSubscription = this.paginator.page.subscribe((event: PageEvent) => {
        this.handlePageEvent(event);
      });
    }
  }

  handlePageEvent(event: PageEvent) {
    // Vérifier si le pageSize a changé avant de mettre à jour
    const pageSizeChanged = event.pageSize !== this.pageSize;
    
    this.pageSize = event.pageSize;
    
    // Quand on change le pageSize, on revient à la première page
    if (pageSizeChanged) {
      this.pageIndex = 0;
    } else {
      this.pageIndex = event.pageIndex;
    }
    
    this.getAssignments(this.pageIndex + 1, this.pageSize); // +1 car l'API commence à 1
  }

  ngOnDestroy() {
    // Nettoyer les abonnements pour éviter les fuites mémoire
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.assignmentsUpdateSubscription) {
      this.assignmentsUpdateSubscription.unsubscribe();
    }
    if (this.paginatorSubscription) {
      this.paginatorSubscription.unsubscribe();
    }
  }

  getAssignments(page: number = 1, limit: number = 15) {
    this.assignmentsService.getAssignments(page, limit).subscribe((response: PaginatedAssignments) => {
      this.assignments = response.docs;
      this.dataSource.data = response.docs;
      this.totalDocs = response.totalDocs;
      this.pageIndex = response.page - 1; // -1 car Material commence à 0
      this.pageSize = response.limit;
      
      // Mettre à jour le paginator si disponible
      if (this.paginator) {
        this.paginator.length = response.totalDocs;
        this.paginator.pageIndex = response.page - 1;
        this.paginator.pageSize = response.limit;
      }
      
      // Forcer la détection de changement après la mise à jour des données
      this.cdr.detectChanges();
    });
  }
}
