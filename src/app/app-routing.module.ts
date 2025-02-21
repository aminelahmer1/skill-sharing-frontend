import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProviderDashboardComponent } from './provider/provider-dashboard/provider-dashboard.component';
import { ReceiverDashboardComponent } from './receiver/receiver-dashboard/receiver-dashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'provider-dashboard', component: ProviderDashboardComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'receiver-dashboard', component: ReceiverDashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }