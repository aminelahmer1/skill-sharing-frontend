import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private readonly BASE_URL = 'http://localhost:8081/auth';
  private readonly HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Getter pour récupérer le token depuis le localStorage
   */
  private get token(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Sauvegarde le token dans le localStorage
   */
  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Authentification de l'utilisateur
   */
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.BASE_URL}/login`,
      { email, password },
      { headers: this.HEADERS }
    ).pipe(
      tap(response => this.saveToken(response.token)),
      catchError(this.handleError)
    );
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(user: any): Observable<any> {
    return this.http.post<string>(
      `${this.BASE_URL}/register`,
      user,
      { headers: this.HEADERS, responseType: 'text' as 'json' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return this.token ? !this.jwtHelper.isTokenExpired(this.token) : false;
  }

  /**
   * Récupère le rôle de l'utilisateur depuis le token
   */
  getRole(): string {
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      return decodedToken?.role || '';
    }
    return '';
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  getCurrentUser(): Observable<any> {
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      return this.http.get<any>(`${this.BASE_URL}/user/${decodedToken.email}`, {
        headers: this.HEADERS
      }).pipe(
        catchError(this.handleError)
      );
    }
    return throwError(() => new Error('No token found'));
  }

  /**
   * Gestion centralisée des erreurs HTTP
   */
  private handleError(error: any) {
    console.error('Error occurred:', error);
    return throwError(() => error);
  }
}