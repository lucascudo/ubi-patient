import { Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CryptService } from '../../services/crypt.service';
import { ProfessionalService } from '../../services/professional.service';
import { AccessLog } from '../../interfaces/access-log';
import { DocumentSnapshot, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-patient-logs',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './patient-logs.component.html',
  styleUrl: './patient-logs.component.scss'
})
export class PatientLogsComponent implements OnInit {
  private readonly cryptService = inject(CryptService);
  private readonly professionalService = inject(ProfessionalService);
  protected columns = ['timestamp', 'professionalEmail'];
  protected dataSource: any[] = [];
  protected defaultDataSource: any[] = [];

  ngOnInit() {
    onSnapshot(this.professionalService.getPatientRef(), (patient: DocumentSnapshot) => {
      const patientData: any = patient.data();
      if (!patientData) return;
      const logs = patientData['accesses'] || [];
      const decryptedLogs = logs.map((log: AccessLog) => this.cryptService.decryptObject(log));
      this.defaultDataSource = decryptedLogs.sort((a: AccessLog, b: AccessLog) => a.timestamp.localeCompare(b.timestamp)).reverse();
      this.dataSource = [ ...this.defaultDataSource ];
      this.professionalService.updateUnreadLogs();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.dataSource = this.defaultDataSource.filter(entity => {
        for (let key of this.columns) {
          if (entity[key].trim().toLowerCase().includes(filterValue)) return true;
        }
        return false;
      });
    } else {
      this.dataSource = [ ...this.defaultDataSource ];
    }
  }
}
