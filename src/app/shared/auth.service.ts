import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  login: string;
  password: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  currentUser: User | null = null;
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  public authStatus$: Observable<boolean> = this.authStatusSubject.asObservable();

  // Tableau d'utilisateurs avec login/password/role
  private users: User[] = [
    { login: 'admin', password: 'admin', role: 'admin' },
    { login: 'user', password: 'user', role: 'user' },
    { login: 'michel', password: 'michel123', role: 'admin' }
  ];

  logIn(login: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const user = this.users.find(u => u.login === login && u.password === password);
      if (user) {
        this.currentUser = user;
        this.loggedIn = true;
        this.authStatusSubject.next(true);
        resolve(true);
      } else {
        this.loggedIn = false;
        this.currentUser = null;
        this.authStatusSubject.next(false);
        resolve(false);
      }
    });
  }

  logout() {
    this.loggedIn = false;
    this.currentUser = null;
    this.authStatusSubject.next(false);
  }

  isLogged(): boolean {
    return this.loggedIn;
  }

  isAdmin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(this.loggedIn && this.currentUser?.role === 'admin');
    });
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  constructor() { }

}
