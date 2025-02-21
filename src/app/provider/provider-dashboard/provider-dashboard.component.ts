import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.css']
})
export class ProviderDashboardComponent implements OnInit {
  user: any = {};

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:8081/users/profile').subscribe(
      response => {
        this.user = response;
      },
      error => {
        console.error('Failed to fetch user profile', error);
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}