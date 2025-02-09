import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Entity } from '../../interfaces/entity';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dialog-patient-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './dialog-patient-details.component.html',
  styleUrl: './dialog-patient-details.component.scss',
})
export class DialogPatientDetailsComponent {
  readonly data = inject<Entity[]>(MAT_DIALOG_DATA);
}
