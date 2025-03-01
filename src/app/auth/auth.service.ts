import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginRequestDTO } from '../models/dtos/login-request-dto';
import {LoginResponseDTO } from '../models/dtos/login-response-dto';
import {RegisterRequestDTO  } from '../models/dtos/register-request-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private readonly BASE_URL = 'http://localhost:8081/auth';
  private readonly HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  // Authentification de l'utilisateur
  login(loginRequest: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(
      `${this.BASE_URL}/login`,
      loginRequest,
      { headers: this.HEADERS }
    ).pipe(
      tap(response => this.saveToken(response.token)),
      catchError(this.handleError)
    );
  }

  // Inscription d'un nouvel utilisateur
  register(registerRequest: RegisterRequestDTO): Observable<string> {
    return this.http.post<string>(
      `${this.BASE_URL}/register`,
      registerRequest,
      { headers: this.HEADERS, responseType: 'text' as 'json' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  // Récupère le rôle de l'utilisateur depuis le token
  getRole(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.role || '';
    }
    return '';
  }

  // Récupère le token depuis le localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Sauvegarde le token dans le localStorage
  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Gestion centralisée des erreurs HTTP
  private handleError(error: any) {
    console.error('Error occurred:', error);
    return throwError(() => error);
  }
}