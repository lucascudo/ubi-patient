import { Routes } from '@angular/router';
import { HomePatientComponent } from './components/home-patient/home-patient.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { HomeProfessionalComponent } from './components/home-professional/home-professional.component';
import { loginGuard } from './guards/login.guard';
import { PatientProfessionalsComponent } from './components/patient-professionals/patient-professionals.component';
import { ViewPatientComponent } from './components/view-patient/view-patient.component';
import { PatientLogsComponent } from './components/patient-logs/patient-logs.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent,canActivate: [loginGuard]},
  {path: 'register', component: RegisterComponent,canActivate: [loginGuard]},
  {path: 'home-patient', component: HomePatientComponent, canActivate: [authGuard], data: { role: 'patient' }},
  {path: 'patient-professionals', component: PatientProfessionalsComponent, canActivate: [authGuard], data: { role: 'patient' }},
  {path: 'patient-logs', component: PatientLogsComponent, canActivate: [authGuard], data: { role: 'patient' }},
  {path: 'home-professional', component: HomeProfessionalComponent, canActivate: [authGuard], data: { role: 'professional' }},
  {path: 'view-patient/:id', component: ViewPatientComponent, canActivate: [authGuard], data: { role: 'professional' }},
  {path: '**', redirectTo: 'home-patient'}
];
