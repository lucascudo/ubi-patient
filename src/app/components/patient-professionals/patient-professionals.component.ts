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
import { ProfessionalService } from '../../services/professional.service';
import { CryptService } from '../../services/crypt.service';
import { Access } from '../../interfaces/access';
import { MatTableModule } from '@angular/material/table';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-patient-professionals',
  standalone: true,
  templateUrl: './patient-professionals.component.html',
  styleUrl: './patient-professionals.component.scss',
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
export class PatientProfessionalsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  private readonly cryptService = inject(CryptService);
  private readonly professionalService = inject(ProfessionalService);
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
      const userId = user.uid;
      const interval = setInterval(() => {
        if (!this.professionalService.isReady()) return;
        this.professionalService.getProfessionals().subscribe((professionals: any[]) => {
          const patients = professionals
            .filter(p => Object.keys(p).includes(userId))
            .map((access) => ({ ...access[userId], professional: access.id }));
          const decryptedData: Access[] = patients.map(access => this.cryptService.decryptObject(access, ['professional']));
          this.defaultDataSource = decryptedData.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).reverse();
          this.dataSource = [ ...this.defaultDataSource ];
        });
        clearInterval(interval);
      }, 200);
    });

    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      const handsetColumns = ['professional', 'patientAccepted', 'actions'];
      const allColumns = ['professional', 'professionalAccepted', 'patientAccepted', 'createdAt', 'actions'];
      this.displayedColumns = (result.matches) ? handsetColumns : allColumns;
    });
  }

  async addInvitation(formDirective: FormGroupDirective) {
    const email = this.invitationForm.value.email?.trim();
    if (!this.invitationForm.valid || !email) {
      return;
    }
    if (!await this.userService.isUserProfessional(email)) {
      this.dialog.open(AlertDialogComponent, {
        data: { content: `Não foi encontrado nenhum profissional com o email: ${email}` },
      });
      return;
    }
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { content: `Conceder acesso aos seus dados a ${email}?` },
    });

    confirmationDialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.professionalService.createAccess(email);
      this.invitationForm.reset();
      formDirective.resetForm();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.dataSource = this.defaultDataSource.filter(access => {
        const searchableColumns = ['email'];
        for (let key of searchableColumns) {
          if (access[key].trim().toLowerCase().includes(filterValue)) return true;
        }
        return false;
      });
    } else {
      this.dataSource = [ ...this.defaultDataSource ];
    }
  }

  changeAcceptance(email: string, event: MatButtonToggleChange) {
    this.professionalService.updatedAcceptance(email, event.value);
  }

  openDeletionDialog(index: number): void {
    const access = this.dataSource[index];
    const content = `Remover o acesso de ${access.professional} definitivamente?`;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Confirmação de Remoção', content },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.professionalService.deleteAccess(access.professional);
    });
  }
}
