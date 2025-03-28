import { Component, inject, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Unsubscribe } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Link } from './interfaces/link';
import { PatientService } from './services/patient.service';
import { ProfessionalService } from './services/professional.service';
import { DocumentSnapshot, onSnapshot } from '@angular/fire/firestore';
import { AccessLog } from './interfaces/access-log';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatBadgeModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink
  ]
})
export class AppComponent implements OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly patientService = inject(PatientService);
  private readonly professionalService = inject(ProfessionalService);
  private readonly router = inject(Router);
  private subscriptions: Subscription[] = [];
  private unsubscriptions: Unsubscribe[] = [];
  protected readonly user$ = this.userService.getUserObservable();
  protected links: Link[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor() {
    this.subscriptions.push(this.user$.subscribe(async (user) => {
      if (!user?.email) return;
      if (await this.userService.isUserProfessional(user.email)) {
        this.unsubscriptions.push(onSnapshot(this.patientService.getProfessionalRef(), (professional: DocumentSnapshot) => {
          const patients = this.patientService.getPatientsFromProfessional(professional);
          const count = patients.filter(access => !access.professionalAcceptedAt).length;
          const badge = count ? count.toString() : '';
          this.links = [
            {path: "/home-professional", label: "Meus pacientes", badge},
          ];
        }));
      } else {
        this.subscriptions.push(this.professionalService.getProfessionals().subscribe((professionals: any[]) => {
          const positiveOrEmpty = (value: number) => value ? value.toString() : '';
          const professionalsWaitingAcceptance = professionals
            .filter(p => Object.keys(p).includes(user.uid))
            .map((professional: any) => professional[user.uid])
            .filter(access => !access.patientAcceptedAt).length;
          this.unsubscriptions.push(onSnapshot(this.professionalService.getPatientRef(), (patient: DocumentSnapshot) => {
            const patientData: any = patient.data();
            if (!patientData) return;
            const logs = patientData['accesses'] || [];
            const unreadLogs = logs.filter((l: AccessLog) => !l.viewedAt).length;
            this.links = [
              {path: "/home-patient", label: "Meus eventos"},
              {path: "/patient-professionals", label: "Meus profissionais", badge: positiveOrEmpty(professionalsWaitingAcceptance)},
              {path: "/patient-logs", label: "Logs de acesso", badge: positiveOrEmpty(unreadLogs)},
            ];
          }));
        }));
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.unsubscriptions.forEach(unsubscribe => unsubscribe());
  }

  isActive(path: string) {
    return this.router.url.includes(path);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}

