import { Routes } from '@angular/router';
import { HomePatientComponent } from './components/home-patient/home-patient.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { HomeProfessionalComponent } from './components/home-professional/home-professional.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home-patient', component: HomePatientComponent, canActivate: [authGuard], data: { role: 'patient' }},
  {path: 'home-professional', component: HomeProfessionalComponent, canActivate: [authGuard], data: { role: 'professional' }},
  {path: '**', redirectTo: 'home-patient'}
];
