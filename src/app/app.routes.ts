import { Routes } from '@angular/router';
import { HomePatientComponent } from './components/home-patient/home-patient.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home-patient', component: HomePatientComponent, canActivate: [authGuard]},
  {path: '**', redirectTo: 'home-patient'}, //TODO change this to different home page in case of different user roles
];
