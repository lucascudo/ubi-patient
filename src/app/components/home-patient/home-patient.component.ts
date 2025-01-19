import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EntityService } from '../../services/entity.service';
import { Entity } from '../../interfaces/entity';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { map, Observable, shareReplay, timestamp } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-home-patient',
  standalone: true,
  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.scss',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HomePatientComponent implements OnInit {
  protected dataSource: any[] = [];
  protected displayedColumns: string[] = [];
  protected entityTypes = ['Medicação', 'Hervanária', 'Alergia', 'Intolerância', 'Sintoma'];
  private entityService = inject(EntityService);
  readonly dialog = inject(MatDialog);
  protected entityForm = new FormGroup({
    type: new FormControl('', Validators.required),
    timestamp: new FormControl('', Validators.required), 
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    description: new FormControl('', Validators.maxLength(500)),
    image: new FormControl(),
  });
  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    const interval = setInterval(() => {
      if (!this.entityService.isReady()) return;
      this.entityService.getEntities().subscribe((data: Entity[]) => {
        this.dataSource = data.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      });
      clearInterval(interval);
    }, 200);
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      const baseColumns = ['type', 'name', 'timestamp'];
      const handsetColumns = baseColumns.concat(['actions']);
      const allColumns = baseColumns.concat(['description', 'image', 'actions']);
      this.displayedColumns = (result.matches) ? handsetColumns : allColumns;
    });
  }

  addEntity(formDirective: FormGroupDirective, fileInput: HTMLInputElement) {
    if (!this.entityForm.valid) {
      return;
    }
    const entity = this.entityForm.value;
    const reload = () => {
      this.entityForm.reset();
      formDirective.resetForm();
      fileInput.value = '';
    };
    if (!entity.image) {
      return this.entityService.addEntity(entity).then(reload);
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64Image = reader.result as string;
        const entityWithImage = {
          ...entity,
          image: base64Image,
        };
        this.entityService.addEntity(entityWithImage).then((result) => {
          reload();
          resolve(result);
        }).catch(reject);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(entity.image);
    });
  }

  onFileChange(event: any) {
    const image = event.target.files[0];
    if (image) {
      this.entityForm.patchValue({ image });
    }
  }

  openDeletionDialog(index: number): void {
    const entity = this.dataSource[index];
    const article = (entity.type === 'Sintoma') ? 'o' : 'a';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { question: `Desejas realmente excluir ${article} ${entity.type}: ${entity.name}?` },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.removeEntity(index);
    });
  }

  removeEntity(index: number) {
    this.entityService.deleteEntity(this.dataSource[index]);
  }
}
