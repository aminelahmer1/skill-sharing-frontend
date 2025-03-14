import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginRequestDTO } from 'src/app/models/dtos/login-request-dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginRequest: LoginRequestDTO = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.loginRequest).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        const role = this.authService.getRole();
        if (role === 'ROLE_PROVIDER') {
          this.router.navigate(['/provider-dashboard']);
        } else {
          this.router.navigate(['/receiver-dashboard']);
        }
      },
      error => {
        this.errorMessage = 'Login failed. Please check your email and password.';
        console.error('Login failed', error);
      }
    );
  }
}