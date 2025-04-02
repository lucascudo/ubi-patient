import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EntityService } from '../../services/entity.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PatientService } from '../../services/patient.service';
import { DocumentSnapshot, onSnapshot } from '@angular/fire/firestore';
import { Access } from '../../interfaces/access';
import { BasePatient } from '../base-patient/base-patient';

@Component({
  selector: 'app-view-patient',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './view-patient.component.html',
  styleUrl: './view-patient.component.scss'
})
export class ViewPatientComponent extends BasePatient implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly entityService = inject(EntityService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);
  protected patientEmail = '';

  ngOnInit() {
    const homePath = '/home-professional';
    const patientId = this.route.snapshot.paramMap.get('id');
    if (!patientId) {
      this.router.navigateByUrl(homePath);
      return;
    }
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(this.handleDisplayedColumns);
    this.entityService.getEntitiesFromPatient(patientId).subscribe(this.handleEntities);
    onSnapshot(this.patientService.getProfessionalRef(), (professional: DocumentSnapshot) => {
      const data = this.patientService.getPatientsFromProfessional(professional);
      const decryptedData: Access[] = data.map(access => this.cryptService.decryptObject(access));
      const access = decryptedData.find(p => p.id === patientId && p.patientAcceptedAt && p.professionalAcceptedAt);
      if (!access) {
        this.router.navigateByUrl(homePath);
        return;
      }
      this.patientEmail = access.email;
      this.patientService.logAccess(patientId, professional.id);
    });
  }
}
