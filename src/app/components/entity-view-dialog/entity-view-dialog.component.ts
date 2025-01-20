import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Entity } from '../../interfaces/entity';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityViewDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EntityViewDialogComponent>);
  readonly data = inject<Entity>(MAT_DIALOG_DATA);
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
