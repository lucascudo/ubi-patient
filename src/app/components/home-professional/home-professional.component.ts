import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PatientService } from '../../services/patient.service';
import { CryptService } from '../../services/crypt.service';
import { Access } from '../../interfaces/access';
import { MatTableModule } from '@angular/material/table';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { onSnapshot } from '@angular/fire/firestore';
import { EntityViewDialogComponent } from '../entity-view-dialog/entity-view-dialog.component';
import { map, take, tap } from 'rxjs';
import { DialogPatientDetailsComponent } from '../dialog-patient-details/dialog-patient-details.component';

@Component({
  selector: 'app-home-professional',
  standalone: true,
  templateUrl: './home-professional.component.html',
  styleUrl: './home-professional.component.scss',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HomeProfessionalComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  private readonly cryptService = inject(CryptService);
  private readonly patientService = inject(PatientService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  protected  displayedColumns: string[] = [];
  protected defaultDataSource: any[] = [];
  protected dataSource: any[] = [];
  protected readonly invitationForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(50),
      (control: AbstractControl): ValidationErrors | null => {
        const isRepeated = this.defaultDataSource.map(a => a.professional).includes(control.value);
        return isRepeated ? { repeated: {value: control.value} } : null;
      }
    ]),
  });

  ngOnInit() {
    this.userService.getUserFirstValue().then(user => {
      if (!user) return;
      const interval = setInterval(() => {
        if (!this.patientService.isReady()) return;
        onSnapshot(this.patientService.getProfessionalRef(), (professional: any) => {
          const data = this.patientService.getPatientsFromProfessional(professional);
          const decryptedData: Access[] = data.map(access => this.cryptService.decryptObject(access));
          this.defaultDataSource = decryptedData.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt)).reverse();
          this.dataSource = [ ...this.defaultDataSource ];
        });
        clearInterval(interval);
      }, 200);
    });

    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      const handsetColumns = ['patient', 'professionalAccepted', 'actions'];
      const allColumns = ['patient', 'patientAccepted', 'professionalAccepted', 'updatedAt', 'actions'];
      this.displayedColumns = (result.matches) ? handsetColumns : allColumns;
    });
  }

  async addInvitation(formDirective: FormGroupDirective) {
    const email = this.invitationForm.value.email?.trim();
    if (!this.invitationForm.valid || !email) {
      return;
    }
    if (!this.patientService.exists(email) || await this.userService.isUserProfessional(email)) {
      this.dialog.open(AlertDialogComponent, {
        data: { content: `Não foi encontrado nenhum utente com o email: ${email}` },
      });
      return;
    }
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { content: `Solicitar acesso aos dados de ${email}?` },
    });

    confirmationDialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.patientService.createAccess(email);
      this.invitationForm.reset();
      formDirective.resetForm();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.dataSource = this.defaultDataSource.filter(entity => {
        const searchableColumns = ['email'];
        for (let key of searchableColumns) {
          if (entity[key].trim().toLowerCase().includes(filterValue)) return true;
        }
        return false;
      });
    } else {
      this.dataSource = [ ...this.defaultDataSource ];
    }
  }

  changeAcceptance(id: string, event: MatButtonToggleChange) {
    this.patientService.updatedAcceptance(id, event.value);
  }

  openDeletionDialog(index: number): void {
    const access = this.dataSource[index];
    const content = `Remover o acesso aos dados de ${access.email} definitivamente?`;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Confirmação de Remoção', content },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.patientService.deleteAccess(access.id);
    });
  }

  openDetailsDialog(patient: any): void {
    this.patientService.getPatientDetails(patient?.id).subscribe((result) => {
        this.dialog.open(DialogPatientDetailsComponent, {
          data: result,
        });
    });
  }
}
