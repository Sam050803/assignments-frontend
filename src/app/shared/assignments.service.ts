import { Injectable } from '@angular/core';
import { Observable, of, catchError, BehaviorSubject, tap, forkJoin, switchMap, map, mergeMap, from } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';
import { getApiUrl } from './config';

// Interface pour la réponse paginée
export interface PaginatedAssignments {
  docs: Assignment[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  // URL de base de l'API backend (utilise la configuration)
  private urlApi = getApiUrl();
  
  // Headers pour les requêtes HTTP
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Subject pour notifier les changements dans la liste
  private assignmentsUpdated$ = new BehaviorSubject<void>(undefined);

  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {
    console.log("Service Assignments créé avec HttpClient !");
  }

  /**
   * Observable pour écouter les mises à jour de la liste
   */
  get assignmentsUpdated(): Observable<void> {
    return this.assignmentsUpdated$.asObservable();
  }

  /**
   * Notifie tous les abonnés qu'une mise à jour est nécessaire
   */
  private notifyUpdate(): void {
    this.assignmentsUpdated$.next(undefined);
  }

  /**
   * Récupère les assignments avec pagination depuis MongoDB
   * GET http://localhost:8010/api/assignments?page=1&limit=15
   * @param page Numéro de la page (défaut: 1)
   * @param limit Nombre d'assignments par page (défaut: 15)
   */
  getAssignments(page: number = 1, limit: number = 15): Observable<PaginatedAssignments> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<PaginatedAssignments>(this.urlApi, { params })
      .pipe(
        catchError(this.handleError<PaginatedAssignments>('getAssignments', {
          docs: [],
          totalDocs: 0,
          limit: limit,
          page: page,
          totalPages: 0,
          pagingCounter: 0,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null
        }))
      );
  }

  /**
   * Récupère un assignment par son ID
   * GET http://localhost:8010/api/assignments/:id
   */
  getAssignment(id: number): Observable<Assignment | undefined> {
    return this.http.get<Assignment>(`${this.urlApi}/${id}`)
      .pipe(
        catchError(this.handleError<Assignment | undefined>('getAssignment', undefined))
      );
  }

  /**
   * Ajoute un nouvel assignment dans MongoDB
   * POST http://localhost:8010/api/assignments
   */
  addAssignment(assignment: Assignment): Observable<any> {
    this.loggingService.log(assignment.nom, 'ajouté');
    
    return this.http.post<any>(this.urlApi, assignment, this.httpOptions)
      .pipe(
        tap(() => this.notifyUpdate()), // Notifie après l'ajout
        catchError(this.handleError<any>('addAssignment'))
      );
  }

  /**
   * Met à jour un assignment existant
   * PUT http://localhost:8010/api/assignments
   * Le backend utilise _id (MongoDB) pour la mise à jour
   */
  updateAssignment(assignment: Assignment): Observable<any> {
    this.loggingService.log(assignment.nom, 'modifié');
    
    // Le backend attend _id dans le body pour UPDATE
    return this.http.put<any>(this.urlApi, assignment, this.httpOptions)
      .pipe(
        tap(() => this.notifyUpdate()), // Notifie après la mise à jour
        catchError(this.handleError<any>('updateAssignment'))
      );
  }

  /**
   * Supprime un assignment
   * DELETE http://localhost:8010/api/assignments/:id
   * Le backend utilise _id (MongoDB) pour la suppression
   */
  deleteAssignment(assignment: Assignment): Observable<any> {
    this.loggingService.log(assignment.nom, 'supprimé');
    
    // Le backend attend _id dans l'URL pour DELETE
    if (!assignment._id) {
      console.error('Impossible de supprimer : _id manquant');
      return of({message: 'Erreur: _id manquant'});
    }
    
    return this.http.delete<any>(`${this.urlApi}/${assignment._id}`)
      .pipe(
        tap(() => this.notifyUpdate()), // Notifie après la suppression
        catchError(this.handleError<any>('deleteAssignment'))
      );
  }

  /**
   * Peuple la base de données avec les assignments depuis le fichier JSON
   * Charge le fichier assignments.json et insère les assignments
   * Génère automatiquement les IDs en évitant les doublons
   */
  peuplerBD(): Observable<any> {
    console.log('Chargement des données depuis assignments.json...');
    
    // Charger le fichier JSON depuis le dossier public
    return this.http.get<any[]>('/assignments.json').pipe(
      switchMap((jsonData: any[]) => {
        console.log(`${jsonData.length} assignments chargés depuis le fichier JSON`);
        
        // D'abord, récupérer tous les assignments existants pour éviter les doublons
        // On utilise une limite très élevée pour récupérer tous les assignments en une fois
        return this.getAssignments(1, 10000).pipe(
          switchMap((response: PaginatedAssignments) => {
            const existingAssignments = response.docs;
            // Trouver le max ID existant
            const maxId = existingAssignments.length > 0 
              ? Math.max(...existingAssignments.map(a => a.id || 0))
              : 0;
            
            // Créer un Set des assignments existants (nom + date) pour éviter les doublons exacts
            const existingAssignmentsSet = new Set(
              existingAssignments.map(a => 
                `${a.nom?.toLowerCase()}_${new Date(a.dateDeRendu).toISOString()}`
              )
            );
            
            // Préparer les nouveaux assignments
            let nextId = maxId + 1;
            const newAssignments: Assignment[] = [];
            const processedInBatch = new Set<string>(); // Pour éviter les doublons dans le même batch
            
            for (const assignmentData of jsonData) {
              const dateDeRendu = new Date(assignmentData.dateDeRendu);
              const key = `${assignmentData.nom?.toLowerCase()}_${dateDeRendu.toISOString()}`;
              
              // Vérifier si l'assignment existe déjà (par nom + date) dans la BD ou dans le batch actuel
              if (!existingAssignmentsSet.has(key) && !processedInBatch.has(key)) {
                // Créer un nouvel assignment avec un ID généré automatiquement
                const newAssignment: Assignment = {
                  id: nextId++,
                  nom: assignmentData.nom,
                  dateDeRendu: dateDeRendu,
                  rendu: assignmentData.rendu
                };
                newAssignments.push(newAssignment);
                processedInBatch.add(key); // Éviter les doublons dans le même batch
              }
            }
            
            if (newAssignments.length === 0) {
              console.log('Aucun nouvel assignment à ajouter (tous existent déjà)');
              return of({ message: 'Aucun nouvel assignment à ajouter', count: 0 });
            }
            
            console.log(`${newAssignments.length} nouveaux assignments à insérer (sur ${jsonData.length} dans le JSON)`);
            console.log(`Assignments existants dans la BD: ${existingAssignments.length}`);
            
            if (newAssignments.length === 0) {
              console.warn('Aucun nouvel assignment à ajouter. Raisons possibles:');
              console.warn('- Tous les assignments du JSON existent déjà dans la BD');
              console.warn('- Tous les noms sont en double dans le JSON');
            }
            
            // Traiter les insertions par lots de 50 pour éviter de surcharger le serveur
            const batchSize = 50;
            const batches: Assignment[][] = [];
            
            for (let i = 0; i < newAssignments.length; i += batchSize) {
              batches.push(newAssignments.slice(i, i + batchSize));
            }
            
            console.log(`Insertion en ${batches.length} lots de ${batchSize} assignments...`);
            
            // Traiter chaque lot séquentiellement, mais les requêtes dans un lot en parallèle
            return from(batches).pipe(
              mergeMap((batch, batchIndex) => {
                console.log(`Traitement du lot ${batchIndex + 1}/${batches.length} (${batch.length} assignments)...`);
                
                const batchObservables = batch.map(assignment => 
                  this.addAssignment(assignment)
                );
                
                return forkJoin(batchObservables).pipe(
                  tap((results) => {
                    const successCount = results.filter(r => r && !r.error).length;
                    console.log(`Lot ${batchIndex + 1} terminé: ${successCount}/${batch.length} assignments ajoutés avec succès`);
                  }),
                  catchError((error) => {
                    console.error(`Erreur dans le lot ${batchIndex + 1}:`, error);
                    console.error('Détails de l\'erreur:', error.message || error);
                    // Continuer avec les autres lots même en cas d'erreur
                    // Retourner un tableau avec des erreurs pour le comptage
                    return of(batch.map(() => ({ error: true })));
                  })
                );
              }, 1), // Concurrency: 1 lot à la fois pour éviter de surcharger
              // Collecter tous les résultats
              map((results) => results.flat()),
              // Compter le nombre total d'assignments ajoutés
              map((allResults) => {
                const successCount = allResults.filter(r => r && !r.error).length;
                return {
                  message: 'Base de données peuplée avec succès !',
                  count: successCount,
                  total: existingAssignments.length + successCount,
                  attempted: newAssignments.length
                };
              }),
              tap((result) => {
                console.log(`${result.count} assignments ajoutés sur ${result.attempted} tentés. Total dans la BD: ${result.total}`);
                this.notifyUpdate(); // Notifie après le peuplement
              }),
              catchError(this.handleError<any>('peuplerBD'))
            );
          }),
          catchError(this.handleError<any>('peuplerBD'))
        );
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement du fichier JSON:', error);
        return of({ 
          message: 'Erreur: Impossible de charger le fichier assignments.json', 
          count: 0,
          error: error.message 
        });
      })
    );
  }

  /**
   * Gestion des erreurs HTTP
   * Cette méthode intercepte les erreurs et les log dans la console
   */
  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Affiche l'erreur dans la console
      console.log(`${operation} a échoué: ${error.message}`);
      
      // Retourne un résultat par défaut pour que l'application continue
      return of(result as T);
    };
  }
}
