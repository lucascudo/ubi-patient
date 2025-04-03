import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Entity } from '../../interfaces/entity';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-entity-view-dialog',
  standalone: true,
  templateUrl: './entity-view-dialog.component.html',
  styleUrl: './entity-view-dialog.component.scss',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityViewDialogComponent {
  readonly data = inject<Entity>(MAT_DIALOG_DATA);
}
