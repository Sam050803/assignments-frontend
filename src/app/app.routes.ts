import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Assignments } from './assignments/assignments';
import { AssignmentsList } from './pages/assignments-list/assignments-list';
import { EditAssignment } from './pages/edit-assignment/edit-assignment';
import { DeleteAssignment } from './pages/delete-assignment/delete-assignment';
import { GenerateTestData } from './pages/generate-test-data/generate-test-data';
import { AddAssignment } from './assignments/add-assignment/add-assignment';
import { AssignmentDetail } from './assignments/assignment-detail/assignment-detail';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment';
import { Login } from './login/login';
import { authGuard } from './shared/auth-guard';

export const routes: Routes = [
  { path: '',redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Assignments },
  { path: 'login', component: Login },
  { path: 'add', component: AddAssignment },
  { path: 'assignment/:id', component: AssignmentDetail },
  { path: 'assignment/:id/edit', component: EditAssignmentComponent, canActivate: [authGuard] }
  //  { path: 'assignments', component: Assignments },
  // { path: 'add-assignment', component: Assignments },
  // { path: 'edit-assignment', component: Assignments },
  // { path: 'delete-assignment', component: Assignments },
  // { path: 'generate-test-data', component: Assignments },
  // { path: 'assignments', component: Assignments },
  // { path: 'add-assignment', component: AddAssignment },
  // { path: 'edit-assignment', component: EditAssignment },
  // { path: 'delete-assignment', component: DeleteAssignment },
  // { path: 'generate-test-data', component: GenerateTestData },
  // { path: '**', redirectTo: '' } // Redirection vers la page d'accueil pour les routes non trouvées
];