import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EntityService } from '../../services/entity.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { CryptService } from '../../services/crypt.service';
import { EntityViewDialogComponent } from '../entity-view-dialog/entity-view-dialog.component';
import { Entity } from '../../interfaces/entity';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PatientService } from '../../services/patient.service';
import { onSnapshot } from '@angular/fire/firestore';
import { Access } from '../../interfaces/access';

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
export class ViewPatientComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly entityService = inject(EntityService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly cryptService = inject(CryptService);
  private readonly patientService = inject(PatientService);
  private readonly baseColumns = ['type', 'name', 'timestamp'];
  protected defaultDataSource: any[] = [];
  protected displayedColumns: string[] = [];
  protected dataSource: any[] = [];
  protected patientEmail = '';

  ngOnInit() {
    const homePath = '/home-professional';
    const patientId = this.route.snapshot.paramMap.get('id');
    if (!patientId) {
      this.router.navigateByUrl(homePath);
      return;
    }
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      const handsetColumns = this.baseColumns.concat(['actions']);
      const allColumns = this.baseColumns.concat(['description', 'image', 'actions']);
      this.displayedColumns = (result.matches) ? handsetColumns : allColumns;
    });
    this.entityService.getEntitiesFromPatient(patientId).subscribe((data: any[]) => {
      const decryptedData: Entity[] = data.map(entity => this.cryptService.decryptObject(entity));
      this.defaultDataSource = decryptedData.sort((a, b) => a.timestamp.localeCompare(b.timestamp)).reverse();
      this.dataSource = [ ...this.defaultDataSource ];
    });
    onSnapshot(this.patientService.getProfessionalRef(), (professional: any) => {
      const data = this.patientService.getPatientsFromProfessional(professional);
      const decryptedData: Access[] = data.map(access => this.cryptService.decryptObject(access));
      const access = decryptedData.find(p => p.id === patientId && p.patientAcceptedAt && p.professionalAcceptedAt);
      if (!access) {
        this.router.navigateByUrl(homePath);
        return;
      }
      this.patientEmail = access.email;
    });
  }

  openDetailsDialog(index: number): void {
    this.dialog.open(EntityViewDialogComponent, {
      data: this.dataSource[index]
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.dataSource = this.defaultDataSource.filter(entity => {
        const searchableColumns = this.baseColumns.concat(['description']);
        for (let key of searchableColumns) {
          if (entity[key].trim().toLowerCase().includes(filterValue)) return true;
        }
        return false;
      });
    } else {
      this.dataSource = [ ...this.defaultDataSource ];
    }
  }
}
